import {Document, Image, Page, StyleSheet, Text, View,} from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 14,
        fontFamily: 'Helvetica',
        backgroundColor: '#f9fafb', // light gray bg like the site
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
        backgroundColor: '#e0f2fe', // light blue bg
        color: '#0284c7',           // blue text
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

// const ticketData = {
//     trainId: train.train_id,
//     from : fromStation,
//     to : toStation,
//     passengers: passengers,
//     noOfSeats : passengers.length,
//     amount: amount,
//     userId: session.user.id,
//     id: train.id,
//     vendorId: train.vendor_id,
//     seats: train.seats,
//     title : train.title,
// }

// Props
type TrainTicket = {
    title: string;
    noOfSeats: number;
    trainId : number;
    id: string;
    from : any,
    to: any,
};

type Props = {
    ticket: TrainTicket;
    qrCodeBase64: string;
    bookedSeats : string[],// Pass base64 QR here
};

function formatDate(dateStr: string){
    const date = new Date(dateStr);
    const weekday = date.toLocaleString('en-US', { weekday: 'short' })
    const day = date.getDate(); // returns 23 (no leading zero)
    const month = date.toLocaleString('en-US', { month: 'short' }); // "Jul"

    return `${weekday}, ${day} ${month}`;
}

const TrainPDF = ({ ticket, qrCodeBase64, bookedSeats }: Props) => (
    <Document>
        <Page size={[595, 620]} style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.movieDetails}>
                    <Text style={styles.movieTitle}>{ticket.title.toUpperCase()}</Text>
                    {/*<View style={{ flexDirection: 'row'}}>*/}
                    {/*    <Text style={[styles.subtitle, {marginRight:25, marginBottom:5}]}>{ticket.movie.ageRating}</Text>*/}
                    {/*    <Text style={styles.subtitle}>{ticket.language}</Text>*/}
                    {/*</View>*/}
                    <Text style={styles.subtitle}># {ticket.trainId}</Text>
                </View>
            </View>

            {/* Ticket Info */}
            <View style={styles.section}>
                <View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Travel Info</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={styles.infoDetails}>{ticket.from.location}</Text>
                            <Text style={styles.infoDetails}>{ticket.to.location}</Text>
                        </View>
                    </View>

                    <Text style={[styles.label, { marginTop: 8 }]}>Seats Info:</Text>
                    <View style={styles.seats}>
                        {bookedSeats.map((seat, i) => (
                            <View key={i} style={styles.seatBox}>
                                <Text>{seat}</Text>
                            </View>
                        ))}
                    </View>

                    {/*<Text style={[styles.label, { marginTop: 8 }]}>Seats Info:</Text>*/}
                    {/*<View style={styles.seats}>*/}
                    {/*    <Text>{ticket.noOfSeats}</Text>*/}
                    {/*</View>*/}

                    {/*<View>*/}
                    {/*    <Text style={[styles.label, {marginBottom:7, marginTop:16}]}>Show ID:</Text>*/}
                    {/*    <Text style={styles.infoDetails}>{ticket.showId}</Text>*/}
                    {/*</View>*/}
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

export default TrainPDF;
