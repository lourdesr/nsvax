const axios = require('axios');


const URL = 'https://sync-cf2-1.canimmunize.ca/fhir/v1/public/booking-page/17430812-2095-4a35-a523-bb5ce45d60f1/appointment-types';


// PFIZER
const pfizerId = '28581000087106';

// MODERNA
// const modernaId = '28571000087109';



axios.get(URL).then((response)=>{
    const results = response.data.results.filter(appt => appt.fullyBooked === false && appt.vaccineConceptId === pfizerId).map(appt => Object.assign({
        id: appt.id,
        name: appt.nameEn,
        fullName: appt.name.en, 
        address: appt.gisLocationString,
    }));

    for(let i = 0; i < results.length; i++) {
        axios.get(`https://sync-cf2-1.canimmunize.ca/fhir/v1/public/availability/17430812-2095-4a35-a523-bb5ce45d60f1?appointmentTypeId=${results[i]['id']}&timezone=America%2FHalifax&preview=false`).then((newRes)=>{
            if (newRes.data.length) {
                results[i]['availabilities'] = newRes.data[0]['availabilities'];
            }
            console.log(results[i]);
            console.log('\n-----------------------------------\n');
        }).catch((err)=>{
            console.log(err);
        })
    }
    // console.log(results);
    console.log(`Total ${results.length} Pfizer vaccines available!`);
}).catch((err)=>console.log(err));
