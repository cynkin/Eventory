import {Document, Image, Page, StyleSheet, Text, View,} from '@react-pdf/renderer';
import { getBase64 } from '@/utils/getBase64';
const logoBase64 = getBase64('src/images/logo.png');

function to12Hour(time24: string): string {
    const [hours, minutes] = time24.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes));

    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

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
    passenger:{
        padding: 5,
        borderRadius: 5,
        backgroundColor: '#fef5e0',
        color: '#000000',
        marginBottom: 5,
        fontSize: 13,
    }
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

type TrainTicket = {
    title: string;
    noOfSeats: number;
    trainId : number;
    id: string;
    from : any,
    to: any,
    passengers: any,
    amount: number;
};

type Props = {
    ticket: TrainTicket;
    qrCodeBase64: string;
    bookedSeats : string[],
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
            <Image src={logoBase64} style={{ width: 150}} />
            <View style={styles.header}>
                <View style={styles.movieDetails}>
                    <Text style={styles.movieTitle}>{ticket.title.toUpperCase()}</Text>
                    {/*<View style={{ flexDirection: 'row'}}>*/}
                    {/*    <Text style={[styles.subtitle, {marginRight:25, marginBottom:5}]}>{download-ticket.movie.ageRating}</Text>*/}
                    {/*    <Text style={styles.subtitle}>{download-ticket.language}</Text>*/}
                    {/*</View>*/}
                    <Text style={styles.subtitle}># {ticket.trainId}</Text>
                </View>
            </View>

            {/* Ticket Info */}
            <View style={styles.section}>
                <View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Travel Info</Text>
                        <Text style={styles.infoDetails}>From : {ticket.from.location}</Text>
                        <Text style={[{marginLeft:20, marginBottom: 2, color: '#374151',}]}>{to12Hour(ticket.from.time)}</Text>
                        <Text style={[{marginLeft:20, marginBottom:12, color: '#374151',}]}>{formatDate(ticket.from.date)}</Text>
                        <Text style={styles.infoDetails}>To : {ticket.to.location}</Text>
                        <Text style={[{marginLeft:20,  marginBottom: 2, color: '#374151',}]}>{to12Hour(ticket.to.time)}</Text>
                        <Text style={[{marginLeft:20, color: '#374151',}]}>{formatDate(ticket.to.date)}</Text>
                    </View>

                    <Text style={[styles.label, { marginTop: 8 }]}>Seats Info:</Text>
                    <View style={styles.seats}>
                        {bookedSeats.map((seat, i) => (
                            <View key={i} style={styles.seatBox}>
                                <Text>{seat}</Text>
                            </View>
                        ))}
                    </View>
                    <View>
                        <Text style={[{color:'#374151'}]}>Amount : {ticket.amount}</Text>
                    </View>

                    <Text style={[styles.label, { marginTop: 16 }]}>Passenger Details:</Text>
                    <View style={[{flexDirection:"column", marginVertical:8}]}>
                        {ticket.passengers.map((passenger:any, i:number) => (
                            <View key={i} style={styles.passenger}>
                                <Text style={[{ marginBottom:2}]}>Name: {passenger.name}</Text>
                                <Text style={[{ marginBottom:2}]}>Age: {passenger.age}</Text>
                                <Text style={[{ marginBottom:1}]}>Gender: {passenger.gender}</Text>
                            </View>
                        ))}
                    </View>

                    {/*<Text style={[styles.label, { marginTop: 8 }]}>Seats Info:</Text>*/}
                    {/*<View style={styles.seats}>*/}
                    {/*    <Text>{download-ticket.noOfSeats}</Text>*/}
                    {/*</View>*/}

                    {/*<View>*/}
                    {/*    <Text style={[styles.label, {marginBottom:7, marginTop:16}]}>Show ID:</Text>*/}
                    {/*    <Text style={styles.infoDetails}>{download-ticket.showId}</Text>*/}
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
