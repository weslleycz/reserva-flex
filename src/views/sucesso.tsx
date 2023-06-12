import React, { ReactElement } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  createTheme,
  ThemeProvider,
} from '@mui/material';
export interface Props {
  code: string;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#05f768',
      contrastText: '#56575F',
    },
    background: {
      default: '#FFFFFF',
    },
  },
});

const Sucesso = ({ code }: Props): ReactElement => (
  <body
    style={{
      background: '#F7F6F6',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
    }}
  >
    <ThemeProvider theme={theme}>
      <Container sx={{ background: '#ffffff', padding: 10 }} maxWidth="sm">
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Pagamento Concluído
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          O seu pagamento foi processado com sucesso.
        </Typography>
        <Typography variant="body1" align="center">
          Código do pagamento: {code}
        </Typography>
        <Box sx={{ align: 'center', justifyContent: 'center', padding: 2 }}>
          <center>
            <a href="http://localhost:5173">
              <Button variant="contained">Voltar para o site</Button>
            </a>
          </center>
        </Box>
      </Container>
    </ThemeProvider>
  </body>
);

export default Sucesso;
