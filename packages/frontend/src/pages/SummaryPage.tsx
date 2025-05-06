import { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Divider,
    CardHeader,
    useTheme,
} from '@mui/material';
import Page from './Page';

const SummaryPage = () => {
    const [summaries, setSummaries] = useState([]);
    const [selected, setSelected] = useState(null);
    const [open, setOpen] = useState(false);

    const theme = useTheme();

    useEffect(() => {
        fetch('http://localhost:3020/summaries')
            .then((res) => res.json())
            .then((data) => setSummaries(data))
            .catch((err) => console.error('Failed to fetch summaries:', err));
    }, []);

    const handleOpen = (item: any) => {
        setSelected(item);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelected(null);
    };

    const renderPreview = (obj: any) => {
        return Object.entries(obj)
            .slice(0, 3)
            .map(([key, value]) => (
                <Typography key={key} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    <strong>{formatKey(key)}:</strong> {Array.isArray(value) ? value.join(', ') : String(value)}
                </Typography>
            ));
    };

    const formatKey = (key: string) => {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase());
    };

    return (
        <Page>
            <Box p={4}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                    Summary Overview
                </Typography>

                <Grid container spacing={3}>
                    {summaries.map((item, idx) => (
                        <Grid item xs={12} sm={6} md={4} key={idx}>
                            <Card elevation={3} sx={{ borderRadius: 2 }}>
                                <CardHeader
                                    title={`Item #${idx + 1}`}
                                    titleTypographyProps={{ variant: 'h6' }}
                                    sx={{
                                        backgroundColor: theme.palette.grey[100],
                                        borderBottom: `1px solid ${theme.palette.divider}`,
                                    }}
                                />
                                <CardContent>
                                    {renderPreview(item)}
                                    <Divider sx={{ my: 2 }} />
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={() => handleOpen(item)}
                                    >
                                        View Details
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                    <DialogTitle sx={{ fontWeight: 600, backgroundColor: theme.palette.grey[100] }}>
                        Summary Details
                    </DialogTitle>
                    <DialogContent dividers>
                        {selected &&
                            Object.entries(selected).map(([key, value]) => (
                                <Box key={key} mb={2}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        {formatKey(key)}
                                    </Typography>
                                    <Typography variant="body1">
                                        {Array.isArray(value) ? value.join(', ') : String(value)}
                                    </Typography>
                                </Box>
                            ))}
                    </DialogContent>
                </Dialog>
            </Box>
        </Page>
    );
};

export default SummaryPage;
