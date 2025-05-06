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
    const [selected, setSelected] = useState<any | null>(null);
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

    const formatKey = (key: string) => {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase());
    };

    const renderPreview = (summary: any) => {
        const userPreview = summary.user
            ? [
                ['Full Name', summary.user.fullName],
                ['Email', summary.user.email],
                ['Company', summary.user.companyName],
            ]
            : [];

        const requestPreview = summary.request
            ? [['Service Type', summary.request.serviceType], ['Work Model', summary.request.workModel]]
            : [];

        return [...userPreview, ...requestPreview].map(([label, value]) => (
            <Typography key={label} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                <strong>{label}:</strong> {Array.isArray(value) ? value.join(', ') : String(value)}
            </Typography>
        ));
    };

    const renderDetails = (obj: any) => {
        return Object.entries(obj).map(([sectionKey, sectionValue]) => (
            <Box key={sectionKey} mb={3}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                    {formatKey(sectionKey)}
                </Typography>
                {typeof sectionValue === 'object' && sectionValue !== null ? (
                    Object.entries(sectionValue).map(([key, value]) => (
                        <Box key={key} mb={1}>
                            <Typography variant="subtitle2" color="text.secondary">
                                {formatKey(key)}
                            </Typography>
                            <Typography variant="body1">
                                {Array.isArray(value) ? value.join(', ') : String(value)}
                            </Typography>
                        </Box>
                    ))
                ) : (
                    <Typography variant="body1">{String(sectionValue)}</Typography>
                )}
            </Box>
        ));
    };

    return (
        <Page>
            <Box p={4}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                    Summary Overview
                </Typography>

                <Grid container spacing={3}>
                    {summaries.map((item: any, idx) => (
                        <Grid item xs={12} sm={6} md={4} key={idx}>
                            <Card elevation={3} sx={{ borderRadius: 2 }}>
                                <CardHeader
                                    title={item.user?.fullName || item.user?.email || `Summary #${idx + 1}`}
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
                        {selected && renderDetails(selected)}
                    </DialogContent>
                </Dialog>
            </Box>
        </Page>
    );
};

export default SummaryPage;
