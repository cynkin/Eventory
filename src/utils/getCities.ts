export async function getCities() {
    const res = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({country: "India"}),
    });

    const data = await res.json();
    console.log(data.data);
}

