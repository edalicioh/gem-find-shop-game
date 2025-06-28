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
  updateDoc
} from 'firebase/firestore';

// Interface para tipagem
interface Platform {
  id: string;
  name: string;
  [key: string]: any;
}

interface Game {
  id: string;
  titulo: string;
  platform_id: string;
  platform?: Platform;
  [key: string]: any;
}

// Cache para plataformas (evita múltiplas consultas)
let platformsCache: Platform[] | null = null;

// Função para buscar todas as plataformas
export const getPlatforms = async (): Promise<Platform[]> => {
  try {
    console.log('Buscando plataformas...');
    
    // Se já temos no cache, retorna
    if (platformsCache) {
      console.log('Usando plataformas do cache:', platformsCache);
      return platformsCache;
    }
    
    const querySnapshot = await getDocs(collection(db, 'platforms'));
    const platforms: Platform[] = [];
    querySnapshot.forEach((doc) => {
      platforms.push({ id: doc.id, ...doc.data() } as Platform);
    });
    
    // Salvar no cache
    platformsCache = platforms;
    console.log('Plataformas encontradas e salvas no cache:', platforms);
    return platforms;
  } catch (error) {
    console.error('Erro ao buscar plataformas:', error);
    throw error;
  }
};

// Função para buscar jogos paginados com plataformas
export const getDocumentsPaginated = async (
  collectionName: string, 
  pageSize: number = 20, 
  lastDoc: any = null,
  searchTerm: string = '',
  filterPlatform: string = 'Todas'
) => {
  try {
    console.log('Parâmetros de busca:', {
      collectionName,
      pageSize,
      searchTerm,
      filterPlatform,
      hasLastDoc: !!lastDoc
    });

    // Primeiro, garantir que temos as plataformas carregadas
    const platforms = await getPlatforms();
    const platformsMap = new Map(platforms.map(p => [p.id, p]));
    console.log('Mapa de plataformas criado:', platformsMap);

    const collectionRef = collection(db, collectionName);
    const constraints = [];

    // Se não for 'Todas', filtrar por plataforma
    if (filterPlatform && filterPlatform !== 'Todas') {
      // Buscar o ID da plataforma pelo nome
      const platform = platforms.find(p => p.name === filterPlatform);
      const platformId = platform?.id;
      
      console.log('Platform ID encontrado:', platformId, 'para filtro:', filterPlatform);
      
      if (platformId) {
        constraints.push(where('platform_id', '==', platformId));
      }
    }
    
    // Ordenação por título
    constraints.push(orderBy('titulo'));
    
    // Paginação
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }
    
    constraints.push(limit(pageSize));
    
    console.log('Constraints aplicadas:', constraints.length);
    
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    console.log('Documentos encontrados:', querySnapshot.size);
    
    const documents: Game[] = [];
    let lastVisible = null;
    
    // Processar cada documento e adicionar informações da plataforma
    querySnapshot.docs.forEach((docSnapshot) => {
      const gameData = { id: docSnapshot.id, ...docSnapshot.data() } as Game;
      console.log('Jogo encontrado:', gameData);
      
      // Buscar informações da plataforma do cache/mapa
      if (gameData.platform_id && platformsMap.has(gameData.platform_id)) {
        gameData.platform = platformsMap.get(gameData.platform_id);
        console.log('Plataforma adicionada ao jogo:', gameData.platform);
      } else {
        console.warn('Plataforma não encontrada para platform_id:', gameData.platform_id);
      }
      
      documents.push(gameData);
      lastVisible = docSnapshot;
    });
    
    // Filtrar por termo de busca localmente (se necessário)
    let filteredDocs = documents;
    if (searchTerm && searchTerm.trim() !== '') {
      const lowerSearch = searchTerm.toLowerCase();
      filteredDocs = documents.filter(doc => 
        doc.titulo?.toLowerCase().includes(lowerSearch) ||
        doc.platform?.name?.toLowerCase().includes(lowerSearch)
      );
      console.log('Documentos após filtro de busca:', filteredDocs.length);
    }
    
    const result = {
      documents: filteredDocs,
      lastDoc: lastVisible,
      hasMore: querySnapshot.docs.length === pageSize
    };
    
    console.log('Resultado final:', result);
    return result;
    
  } catch (error) {
    console.error('Erro detalhado ao buscar documentos:', error);
    throw error;
  }
};

// Função para contar total de jogos
export const getDocumentsCount = async (collectionName: string, filterPlatform: string = 'Todas'): Promise<number> => {
  try {
    console.log('Contando documentos para:', filterPlatform);
    
    const collectionRef = collection(db, collectionName);
    let q;
    
    if (filterPlatform && filterPlatform !== 'Todas') {
      // Buscar o ID da plataforma pelo nome usando o cache
      const platforms = await getPlatforms();
      const platform = platforms.find(p => p.name === filterPlatform);
      const platformId = platform?.id;
      
      if (platformId) {
        q = query(collectionRef, where('platform_id', '==', platformId));
      } else {
        q = query(collectionRef);
      }
    } else {
      q = query(collectionRef);
    }
    
    const querySnapshot = await getDocs(q);
    console.log('Total de documentos:', querySnapshot.size);
    return querySnapshot.size;
  } catch (error) {
    console.error('Erro ao contar documentos:', error);
    throw error;
  }
};

// Função para limpar cache (útil se as plataformas forem atualizadas)
export const clearPlatformsCache = () => {
  platformsCache = null;
  console.log('Cache de plataformas limpo');
};

// Função para buscar um jogo específico com sua plataforma
export const getGameWithPlatform = async (gameId: string): Promise<Game | null> => {
  try {
    const gameDoc = await getDoc(doc(db, 'games', gameId));
    if (!gameDoc.exists()) {
      return null;
    }
    
    const gameData = { id: gameDoc.id, ...gameDoc.data() } as Game;
    
    // Buscar plataforma
    if (gameData.platform_id) {
      const platforms = await getPlatforms();
      const platform = platforms.find(p => p.id === gameData.platform_id);
      if (platform) {
        gameData.platform = platform;
      }
    }
    
    return gameData;
  } catch (error) {
    console.error('Erro ao buscar jogo com plataforma:', error);
    throw error;
  }
};


export const updateDocument = async (collection, docId, data) => {
  try {
    const docRef = doc(db, collection, docId);
    await updateDoc(docRef, data);
    console.log('Document updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};
