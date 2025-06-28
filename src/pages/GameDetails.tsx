
import React from 'react';
import GameDetailsPage from '@/components/GameDetailsPage';

const GameDetails = () => {
  const sonicManiaData = {
    name: "SONIC MANIA",
    background_image: "https://media.rawg.io/media/games/bbf/bbf8d74ab64440ad76294cff2f4d9cfa.jpg",
    description: "Experience the ultimate celebration of past and future in Sonic Mania, an all-new 2D Sonic adventure running at a crisp 60FPS with stunning HD retro-style graphics. Multiple playable characters give you the ability to go explosively fast as Sonic, soar as Tails, or power through tough obstacles with Knuckles' brute strength. You can re-live the Sonic of the past with an exciting new twist on classic zones while fighting against new bosses and Dr. Eggman's evil robot army. Go head to-head with players in Competition Mode or play in Co-Op Mode with a friend. Sonic Mania was developed by Christian Whitehead, Headcannon, and PagodaWest Games in collaboration with Sonic Team. Welcome to Sonic Mania!",
    metacritic_score: 85,
    platforms: ["PC", "Xbox One", "PlayStation 4", "Nintendo Switch"],
    released: "2017-08-15",
    size: "174.82 MB",
    link: "https://www.mediafire.com/file/fkvhbnzune2pc8s/SONIC_MANIA.zip/file"
  };

  return <GameDetailsPage gameData={sonicManiaData} />;
};

export default GameDetails;
