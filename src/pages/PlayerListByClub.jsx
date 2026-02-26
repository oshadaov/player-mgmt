import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../auth/api";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

const PlayerListByClub = () => {
  const { clubId } = useParams();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    API.get("/users/all").then((res) => {
      const clubPlayers = res.data.filter(
        (u) => u.role === "PLAYER" && u.club?.id === parseInt(clubId)
      );
      setPlayers(clubPlayers);
    });
  }, [clubId]);

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 10 }}>
      <Typography variant="h5" gutterBottom>
        Player List
      </Typography>
      <List>
        {players.map((player) => (
          <ListItem key={player.id}>
            <ListItemText primary={player.name} secondary={`Username: ${player.username}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default PlayerListByClub;
