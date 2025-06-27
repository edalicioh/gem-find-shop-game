
import { db } from '../config/firebase';
import { 
  collection, 
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  where,
  doc,
  getDoc,
  QueryConstraint
} from 'firebase/firestore';

// Tipos para os dados
interface Console {
  id: string;
  name: string;
  [key: string]: any;
}

interface Game {
  id: string;
  titulo: string;
  console_id: string;
  console?: Console;
  [key: string]: any;
}

// Função para buscar todos os consoles (para as tags)
export const getConsoles = async (): Promise<Console[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'consoles'));
    const consoles: Console[] = [];
    querySnapshot.forEach((doc) => {
      consoles.push({ id: doc.id, ...doc.data() } as Console);
    });
    return consoles;
  } catch (error) {
    console.error('Erro ao buscar consoles:', error);
    throw error;
  }
};

// Função para buscar jogos paginados
export const getDocumentsPaginated = async (
  collectionName: string, 
  pageSize: number = 20, 
  lastDoc: any = null,
  searchTerm: string = '',
  filterConsole: string = 'Todas'
) => {
  console.log(filterConsole);
  
  try {
    const collectionRef = collection(db, collectionName);
    const constraints: QueryConstraint[] = [];

    // Filter by console
    if (filterConsole && filterConsole !== 'Todas') {
      constraints.push(where('console_id', '==', filterConsole));
    }

    // Order by title
    constraints.push(orderBy('titulo'));

    // Pagination
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    // Limit
    constraints.push(limit(pageSize));

    // Build query
    const q = query(collectionRef, ...constraints);

    // Fetch documents
    const querySnapshot = await getDocs(q);
    const documents: Game[] = [];
    let lastVisible = null;

    // Fetch game and console data
    for (const docSnapshot of querySnapshot.docs) {
      const gameData: Game = { id: docSnapshot.id, ...docSnapshot.data() } as Game;

      // Fetch console info
      if (gameData.console_id) {
        try {
          const consoleDoc = await getDoc(doc(db, 'consoles', gameData.console_id));
          if (consoleDoc.exists()) {
            gameData.console = { id: consoleDoc.id, ...consoleDoc.data() } as Console;
          }
        } catch (error) {
          console.error('Erro ao buscar console:', error);
        }
      }

      documents.push(gameData);
      lastVisible = docSnapshot;
    }

    // Local search filter
    let filteredDocs = documents;
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filteredDocs = documents.filter(doc => 
        doc.titulo?.toLowerCase().includes(lowerSearch) ||
        doc.console?.name?.toLowerCase().includes(lowerSearch)
      );
    }

    return {
      documents: filteredDocs,
      lastDoc: lastVisible,
      hasMore: querySnapshot.docs.length === pageSize
    };
  } catch (error) {
    console.error('Erro ao buscar documentos paginados:', error);
    throw error;
  }
};

// Função para contar total de jogos
export const getDocumentsCount = async (collectionName: string, filterConsole: string = 'Todas'): Promise<number> => {
  try {
    const collectionRef = collection(db, collectionName);
    let q;
    
    if (filterConsole && filterConsole !== 'Todas') {
      q = query(collectionRef, where('console_id', '==', filterConsole.toLowerCase()));
    } else {
      q = query(collectionRef);
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Erro ao contar documentos:', error);
    throw error;
  }
};
