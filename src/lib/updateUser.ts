const updateUser = async(userData: {name?: string, role?:string}) => {
    try{
        const res = await fetch("/api/user/update", {
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify(userData)
        });
        const data = await res.json();
        if(!res.ok) new Error(data.error);
        console.log(data, "SUCCESS");
        return data;
    }
    catch(err){
        console.log(err);
        return;
    }
}

export default updateUser;