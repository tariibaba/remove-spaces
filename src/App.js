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
} from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import { ContentCopy } from '@mui/icons-material';
import AppSnackbar from './components/AppSnackbar';
import MouseTrap from 'mousetrap';

function decreaseIndent({ text, amount, auto }) {
  let spaceCount;
  if (auto) {
    const findFirstSpace = new RegExp(String.raw`^(\s*).+?((\r\n)|\n|$)`);
    const firstSpaces = text.match(findFirstSpace)[1];
    spaceCount = firstSpaces.length;
  } else {
    spaceCount = amount;
  }

  const regex = new RegExp(
    String.raw`\s{0,${spaceCount}}(.+?((\r\n)|\n|$))`,
    'g'
  );
  const result = text.replace(regex, '$1');
  return result;
}

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [amount, setAmount] = useState(0);
  const [amountInput, setAmountInput] = useState('');

  const handleAmountInputChange = (event) => {
    setAmountInput(event.target.value);
  };

  const handleAmountBlur = () => {
    const newValue = Number(amountInput || '0');
    setAmount(newValue);
    setAmountInput(String(newValue));
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleDecreaseIndent = () => {
    handleAmountBlur();
    setOutput(decreaseIndent({ text: input, amount, auto }));
    notify('Decreased indent');
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output);
    notify('Copied output to clipboard');
  };

  const makeOutputInput = () => {
    setInput(output);
  };

  const handleMakeOutputInput = () => {
    makeOutputInput();
    notify('Made output input');
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

  const [auto, setAuto] = useState(false);
  const handleAutoChange = (event) => {
    setAuto(event.target.checked);
  };

  const addHotKeys = () => {
    MouseTrap.bind(['ctrl+e', 'command+e'], () => {
      handleMakeOutputInput();
      return false;
    });
    MouseTrap.bind(['ctrl+i', 'command+i'], () => {
      handlePasteInput();
      return false;
    });
    MouseTrap.bind(['ctrl+d', 'command+d'], () => {
      handleDecreaseIndent();
      return false;
    });
    MouseTrap.bind(['ctrl+o', 'command+o'], () => {
      handleCopyOutput();
      return false;
    });
    MouseTrap.bind(['ctrl+enter', 'command+enter'], () => {
      handlePasteDecreaseCopy();
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

  const handlePasteDecreaseCopy = async () => {
    const input = await navigator.clipboard.readText();
    const output = decreaseIndent({ text: input, amount, auto });
    navigator.clipboard.writeText(output);
    setInput(input);
    setOutput(output);
    notify('Pasted, decreased and copied');
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: 2,
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={handleShowHotKeys}>
          Keyboard shortcuts
        </Button>
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ flex: 1 }}></Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <TextField
            type="number"
            label="Amount"
            value={amountInput}
            onChange={handleAmountInputChange}
            onBlur={handleAmountBlur}
            inputProps={{ className: 'mousetrap' }}
            disabled={auto}
          ></TextField>
        </Box>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box sx={{ paddingLeft: 2 }}>
            <FormControlLabel
              control={<Checkbox checked={auto} onChange={handleAutoChange} />}
              label="Auto"
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <Button onClick={handlePasteDecreaseCopy} variant="contained">
          Paste + Decrease + Copy
        </Button>
      </Box>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        sx={{ flexWrap: 'wrap', marginTop: 2 }}
      >
        <Box>
          <Button onClick={handlePasteInput} variant="outlined">
            Paste input
          </Button>
        </Box>
        <Box>
          <Button onClick={handleDecreaseIndent} variant="outlined">
            Decrease indent
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
        <Box>
          <Button onClick={handleMakeOutputInput} variant="outlined">
            Make output input
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
                  <TableCell>Paste + decrease + copy</TableCell>
                  <TableCell>Ctrl + Enter</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Paste input</TableCell>
                  <TableCell>Ctrl + I</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Decrease indent</TableCell>
                  <TableCell>Ctrl + D</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Copy output</TableCell>
                  <TableCell>Ctrl + O</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Make output input</TableCell>
                  <TableCell>Ctrl + E</TableCell>
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
    </Box>
  );
}

export default App;
