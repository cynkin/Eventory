'use client';
import {TicketSlash, Hash, Calendar} from "lucide-react"
import Link from "next/link";
import {Station} from "../../../types/eventStore";

interface TrainProps{
    title: string,
    id: string,
    trainId : number;
    stations : Station[];
    from: Station;
    to: Station;
}

// const days = ["S", "T", "W", "F", "S"];
// const totalDays = ["S", "M", "T", "W", "T", "F", "S"];

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

export default function TrainCard(props: TrainProps){
    const start = props.stations[0];
    const end = props.stations[props.stations.length - 1];

    let from = start.location.substring(0, start.location.indexOf("-"));

    let fromTime = start.time;
    let to = end.location.substring(0, end.location.indexOf("-"));
    let toTime = end.time;

    let startDateTime = new Date(`${start.date}T${start.time}`);
    let endDateTime = new Date(`${end.date}T${end.time}`);

    let cost = props.stations[props.stations.length - 1].cost;
    // let i = 0;
    // let j = 0;
    let flag = false;
    if(props.from && props.to){
        from = props.from.location;
        to = props.to.location;
        cost = props.to.cost - props.from.cost;
        startDateTime = new Date(`${props.from.date}T${props.from.time}`);
        endDateTime = new Date(`${props.to.date}T${props.to.time}`);
        fromTime = props.from.time;
        toTime = props.to.time;
        flag = true;
    }

    const msDiff = endDateTime.getTime() - startDateTime.getTime();
    const totalMinutes = Math.floor(msDiff / 1000 / 60);
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes %(60*24)/60));
    const minutes = totalMinutes % 60;
    let duration = "";
    if (days > 0) duration += `${days}d `;
    if (hours > 0 || days > 0) duration += `${hours}h `;
    if (minutes > 0 || (days === 0 && hours === 0)) duration += `${minutes}m`
    duration = duration.trim();

    return(
        <Link href={`/train-booking?id=${props.id}`} className="hover:cursor-pointer rounded-2xl border border-gray-300 border-b-white flex flex-col">
            {/*<div className="rounded-2xl w-[300px] h-[150px] relative overflow-hidden">*/}
            {/*    <Image alt="" className="scale-110 overflow-hidden transition-all ease-in-out duration-300"  style={{ objectFit:"cover", objectPosition: "center"}}   fill*/}
            {/*           src="https://media.assettype.com/freepressjournal/2024-09-22/f4ex9n8p/media-desktop-coldplay-music-of-the-spheres-world-tour-0-2024-9-18-t-18-45-42.avif" priority />*/}
            {/*</div>*/}
            <div className={`w-fit`}></div>
            <div className="mt-3 px-3 flex items-center flex-row">
                <div className=" text-xl font-medium ">{props.title}</div>
            </div>
            <div className="flex items-center text-sm px-1 py-0.5 text-gray-600">
                <Hash className="ml-2 mr-0.5 w-4 h-4"/> {props.trainId}
                {/*<div className="mx-3 ">|</div>*/}
                {/*<div className="flex items-center">*/}
                {/*    <Calendar className=" mr-1 w-4 h-4"/>*/}
                {/*    <div className="flex flex-row">Departs on*/}
                {/*        {totalDays.map(day => {*/}
                {/*            j++;*/}
                {/*            if (day === days[i]) {*/}
                {/*                i++;*/}
                {/*                return <div className="mx-0.5 text-green-500" key={j}>{day}</div>*/}
                {/*            }*/}
                {/*            else {*/}
                {/*                return <div className="mx-0.5" key={j}>{day}</div>*/}
                {/*            }*/}
                {/*        })}*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>

            <div className="flex mt-3 items-center justify-center space-x-2">
                <div className="text-gray-800 text-nowrap ml-3 text-lg">{from}</div>
                <div className="flex-grow min-w-10 h-0.5 bg-gray-300"></div>
                <div className="text-green-500 text-nowrap text-sm font-medium">{duration}</div>
                <div className="flex-grow min-w-10 h-0.5 bg-gray-300"></div>
                <div className="text-gray-800 text-nowrap mr-3 text-lg">{to}</div>
            </div>


            {/*<div className="flex mt-3 items-center justify-center space-x-2">*/}
            {/*    <div className="text-gray-800 text-nowrap ml-3 text-lg">{from}</div>*/}
            {/*    <div className="flex-grow min-w-10 h-0.5 bg-gray-300"></div>*/}
            {/*    <div className="text-green-500 text-sm font-medium">{duration}</div>*/}
            {/*    <div className="flex-grow min-w-10 h-0.5 bg-gray-300"></div>*/}
            {/*    <div className="text-gray-800 text-nowrap mr-3 text-lg">{to}</div>*/}
            {/*</div>*/}

            <div className="flex items-center justify-between space-x-2 mb-4">
                <div className="text-gray-600 ml-5 text-sm font-medium">{to12Hour(fromTime)}</div>
                <div className="text-gray-600 mr-5  text-sm font-medium">{to12Hour(toTime)}</div>
            </div>

            {/*<div className="flex text-sm px-1 py-0.5 text-gray-700">*/}
            {/*    <Calendar className="mx-2 mr-2 w-5 h-5"/>{props.fromDate} - {props.toDate}*/}
            {/*</div>*/}
            {/*<div className="flex items-center text-sm px-1 py-0.5 text-gray-700">*/}
            {/*    <TicketSlash className="mx-2 mr-2 w-5 h-5"/> {props.available} / {props.total} Available*/}
            {/*</div>*/}


            <div className="text-xl tracking-wider mt-2 px-4 text-right">&#8377; {cost}</div>
            <div className=" text-xs text-gray-800 px-4 text-right">per person</div>
            <div className=" text-xs text-gray-800 px-4 text-right">Inclusive of taxes and meals</div>

        </Link>
    )
}
