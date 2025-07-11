import {Document, Image, Page, StyleSheet, Text, View,} from '@react-pdf/renderer';
import { getBase64 } from '@/utils/getBase64';
const logoBase64 = getBase64('src/images/logo.png');

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 14,
        fontFamily: 'Helvetica',
        backgroundColor: '#f9fafb',
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        padding: 12,
        borderRadius: 12,
        border: '1 solid #e5e7eb',
        marginBottom: 16,
    },
    movieImage: {
        height:140,
        borderRadius: 8,
        objectFit: 'cover',
        marginRight: 16,
    },
    movieDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    movieTitle: {
        fontSize: 24,
        fontWeight: 700,
        color: '#111827',
        marginBottom: 6,
        letterSpacing: 1.05,
    },
    subtitle: {
        fontSize: 14,
        color: '#374151',
        marginBottom:3,
    },
    section: {
        padding: 16,
        backgroundColor: '#ffffff',
        border: '1 solid #e5e7eb',
        borderRadius: 12,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
    },
    infoRow: {
        marginBottom: 8,
    },
    label: {
        fontWeight: 600,
        color: '#374151',
        marginBottom: 5,
    },
    infoDetails: {
        fontSize: 13,
        color: '#374151',
        marginLeft:3
    },
    seats: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 8,
    },
    seatBox: {
        padding: 6,
        borderRadius: 6,
        backgroundColor: '#e0f2fe',
        color: '#0284c7',
        marginRight: 6,
        marginBottom: 2,
        fontSize: 15
    },
    snackBar: {
        backgroundColor: '#fefce8',
        padding: 10,
        borderRadius: 8,
        marginVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1 solid #fde68a',
    },
    qrSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        alignItems: 'center',
    },
    qrCode: {
        width: 140,
        height: 140,
    },
});

type ConcertTicket = {
    image: string;
    title: string;
    date: string;
    time: string;
    location: string;
    cost: number;
    noOfSeats: number;
    concertId: string;
    showId: string;
    id: string;
};

type Props = {
    ticket: ConcertTicket;
    qrCodeBase64: string;
};

function formatDate(dateStr: string){
    const date = new Date(dateStr);
    const weekday = date.toLocaleString('en-US', { weekday: 'short' })
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' }); // "Jul"

    return `${weekday}, ${day} ${month}`;
}

const ConcertPDF = ({ ticket, qrCodeBase64 }: Props) => (
    <Document>
        <Page size={[595, 620]} style={styles.page}>
            <Image src={logoBase64} style={{ width: 150}} />
            <View style={styles.header}>
                <Image src={ticket.image} style={styles.movieImage} />
                <View style={styles.movieDetails}>
                    <Text style={styles.movieTitle}>{ticket.title.toUpperCase()}</Text>
                    {/*<View style={{ flexDirection: 'row'}}>*/}
                    {/*    <Text style={[styles.subtitle, {marginRight:25, marginBottom:5}]}>{download-ticket.movie.ageRating}</Text>*/}
                    {/*    <Text style={styles.subtitle}>{download-ticket.language}</Text>*/}
                    {/*</View>*/}
                    <Text style={styles.subtitle}>{ticket.location}</Text>
                </View>
            </View>

            {/* Ticket Info */}
            <View style={styles.section}>
                <View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Show Date & Time</Text>
                        <Text style={styles.infoDetails}>{formatDate(ticket.date)}, {ticket.time}</Text>
                    </View>


                    <Text style={[styles.label, { marginTop: 8 }]}>Seats Info:</Text>
                    <View style={styles.seats}>
                        <Text>{ticket.noOfSeats}</Text>
                    </View>

                    <View>
                        <Text style={[styles.label, {marginBottom:7, marginTop:16}]}>Show ID:</Text>
                        <Text style={styles.infoDetails}>{ticket.showId}</Text>

                    </View>
                    <View>
                        <Text style={[styles.label, {marginBottom:7, marginTop:16}]}>Booking ID:</Text>
                        <Text style={styles.infoDetails}>{ticket.id}</Text>

                    </View>
                </View>
                <View>
                    <Image src={qrCodeBase64} style={styles.qrCode} />
                </View>
            </View>
        </Page>
    </Document>
);

export default ConcertPDF;
