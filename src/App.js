import {
  TextField,
  Box,
  Button,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  DialogActions,
  Checkbox,
  FormControlLabel,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import {
  ContentCopy,
  ContentPaste,
  Remove,
  RemoveCircle,
} from '@mui/icons-material';
import AppSnackbar from './components/AppSnackbar';
import MouseTrap from 'mousetrap';
import removeSpaces from './remove-spaces';
import cbLogo from './images/cb-logo-extended.png';

const theme = createTheme({});

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [leading, setLeading] = useState(true);
  const [trailing, setTrailing] = useState(true);
  const [preserveIndent, setPreserveIndent] = useState(true);

  const handleLeadingChange = (event) => {
    setLeading(event.target.checked);
  };

  const handleTrailingChange = (event) => {
    setTrailing(event.target.checked);
  };

  const handlePreserveIndentChange = (event) => {
    setPreserveIndent(event.target.checked);
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleRemoveSpaces = () => {
    setOutput(removeSpaces({ text: input, leading, trailing, preserveIndent }));
    notify('Removed spaces');
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output);
    notify('Copied output to clipboard');
  };

  const pasteInput = async () => {
    setInput(await navigator.clipboard.readText());
  };

  const handlePasteInput = async () => {
    await pasteInput();
    notify('Pasted input');
  };

  useEffect(() => {
    removeHotKeys();
    addHotKeys();
  });

  const addHotKeys = () => {
    MouseTrap.bind(['ctrl+i', 'command+i'], () => {
      handlePasteInput();
      return false;
    });
    MouseTrap.bind(['ctrl+d', 'command+d'], () => {
      handleRemoveSpaces();
      return false;
    });
    MouseTrap.bind(['ctrl+o', 'command+o'], () => {
      handleCopyOutput();
      return false;
    });
    MouseTrap.bind(['ctrl+enter', 'command+enter'], () => {
      handlePasteRemoveCopy();
      return false;
    });
  };

  const removeHotKeys = () => {
    MouseTrap.reset();
  };

  const [showHotKeys, setShowHotKeys] = useState(false);
  const handleShowHotKeys = () => {
    setShowHotKeys(true);
  };

  const handleHideHotKeys = () => {
    setShowHotKeys(false);
  };

  const [snackbarMessage, setSnackbarMessage] = useState(undefined);

  const notify = (message) => {
    setSnackbarMessage({ message });
  };

  const handlePasteRemoveCopy = async () => {
    const input = await navigator.clipboard.readText();
    const output = removeSpaces({
      text: input,
      leading,
      trailing,
      preserveIndent,
    });
    navigator.clipboard.writeText(output);
    setInput(input);
    setOutput(output);
    notify('Pasted, removed, and copied');
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 2,
          boxSizing: 'border-box',
        }}
      >
        <Box sx={{ display: 'flex' }}>
          <Typography variant="h6">Remove Spaces</Typography>
          <Button
            sx={{ marginLeft: 'auto' }}
            variant="text"
            onClick={handleShowHotKeys}
          >
            Keyboard shortcuts
          </Button>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box
            sx={{
              display: 'flex',
            }}
          >
            <FormControlLabel
              control={
                <Checkbox checked={leading} onChange={handleLeadingChange} />
              }
              label="Remove leading spaces"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={preserveIndent}
                  onChange={handlePreserveIndentChange}
                />
              }
              label="Preserve indent"
            />
            <FormControlLabel
              control={
                <Checkbox checked={trailing} onChange={handleTrailingChange} />
              }
              label="Remove trailing spaces"
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <Button onClick={handlePasteRemoveCopy} variant="contained">
            Paste + Remove + Copy
          </Button>
        </Box>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ flexWrap: 'wrap', marginTop: 2 }}
        >
          <Box>
            <Button
              onClick={handlePasteInput}
              variant="outlined"
              startIcon={<ContentPaste />}
            >
              Paste input
            </Button>
          </Box>
          <Box>
            <Button
              onClick={handleRemoveSpaces}
              variant="outlined"
              startIcon={<RemoveCircle />}
            >
              Remove spaces
            </Button>
          </Box>
          <Box>
            <Button
              startIcon={<ContentCopy />}
              onClick={handleCopyOutput}
              variant="outlined"
            >
              Copy output
            </Button>
          </Box>
        </Stack>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            justifyContent: 'stretch',
            marginTop: 2,
            rowGap: '16px',
          }}
        >
          <Box sx={{ flex: 1, marginRight: 1 }}>
            <Typography>Input</Typography>
            <TextField
              onChange={handleInputChange}
              sx={{ width: '100%', marginTop: 1, minWidth: '300px' }}
              multiline
              value={input}
              minRows={10}
              inputProps={{
                className: 'mousetrap',
                style: { maxHeight: '300px', overflow: 'auto' },
              }}
            ></TextField>
          </Box>
          <Box sx={{ flex: 1, marginLeft: 1, textAlign: 'right' }}>
            <Typography>Output</Typography>
            <TextField
              sx={{
                width: '100%',
                marginTop: 1,
                minWidth: '300px',
              }}
              multiline
              value={output}
              readOnly
              minRows={10}
              inputProps={{
                className: 'mousetrap',
                style: { maxHeight: '300px', overflow: 'auto' },
              }}
            ></TextField>
          </Box>
        </Box>

        <Dialog open={showHotKeys}>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <DialogContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Action</TableCell>
                    <TableCell>Shortcut</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Paste + Remove + Copy</TableCell>
                    <TableCell>Ctrl + Enter</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Paste input</TableCell>
                    <TableCell>Ctrl + I</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Remove spaces</TableCell>
                    <TableCell>Ctrl + D</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Copy output</TableCell>
                    <TableCell>Ctrl + O</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleHideHotKeys}>Close</Button>
          </DialogActions>
        </Dialog>
        <AppSnackbar messageInfo={snackbarMessage} />
        <a href="https://codingbeautydev.com?utm_source=remove-spaces.web.app&utm_medium=referral&utm_campaign=home">
          <Box sx={{ position: 'absolute', right: '8px', bottom: '8px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Typography sx={{ fontSize: 13, color: 'black' }}>
                Powered by
              </Typography>
            </Box>
            <img src={cbLogo} height={16} />
          </Box>
        </a>
      </Box>
    </ThemeProvider>
  );
}

export default App;
