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
  getDoc
} from 'firebase/firestore';

// Função para buscar todos os consoles (para as tags)
export const getConsoles = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'consoles'));
    const consoles = [];
    querySnapshot.forEach((doc) => {
      consoles.push({ id: doc.id, ...doc.data() });
    });
    return consoles;
  } catch (error) {
    console.error('Erro ao buscar consoles:', error);
    throw error;
  }
};

// Função para buscar jogos paginados
export const getDocumentsPaginated = async (
  collectionName, 
  pageSize = 20, 
  lastDoc = null,
  searchTerm = '',
  filterConsole = 'Todas'
) => {
  console.log(filterConsole);
  
  try {
    let q = collection(db, collectionName);
    const constraints = [];

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
    q = query(q, ...constraints);

    // Fetch documents
    const querySnapshot = await getDocs(q);
    const documents = [];
    let lastVisible = null;

    // Fetch game and console data
    for (const docSnapshot of querySnapshot.docs) {
      const gameData = { id: docSnapshot.id, ...docSnapshot.data() };

      // Fetch console info
      if (gameData.console_id) {
        try {
          const consoleDoc = await getDoc(doc(db, 'consoles', gameData.console_id));
          if (consoleDoc.exists()) {
            gameData.console = consoleDoc.data();
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
export const getDocumentsCount = async (collectionName, filterConsole = 'Todas') => {
  try {
    let q = collection(db, collectionName);
    
    if (filterConsole && filterConsole !== 'Todas') {
      q = query(q, where('console_id', '==', filterConsole.toLowerCase()));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Erro ao contar documentos:', error);
    throw error;
  }
};