import react, {useState, useEffect} from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';

import { IVacation } from '../../../../shared/IVacation';
import { api } from '../apiUrl';

const Reports = () => {

    const [apiData, setApiData] = useState<IVacation[]>([]);

    const fetchData = async () => {
        try{
            const followedVacations = await api.get('/followed-vacations');
            setApiData(followedVacations.data);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    let followedVacations:Record<string, number> = {};

    apiData.map((vacation) => {
        if(vacation.location in followedVacations){
            followedVacations[vacation.location]++;
        }else{
            followedVacations[vacation.location] = 1;
        }
    });

    // Old way
    //let locations:string[] = [];
    // apiData.map((vacation) => {
    //     if(locations.includes(vacation.location)){
    //         followedVacations[vacation.location]++;
    //     }else{
    //         locations.push(vacation.location);
    //         followedVacations[vacation.location] = 1;
    //     }
    // });

    // console.log('= = = = = = = = = =');
    // console.log(followedVacations);
    // console.log('= = = = = = = = = =');

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
      );

    const options = {
        responsive: true,
        plugins: {
            legend: {
            position: 'top' as const,
            },
            title: {
            display: true,
            text: 'Followed Vacations Report',
            },
        },
    };

    const labels = Object.keys(followedVacations);

    const data = {
        labels,
        datasets: [
          {
            label: 'Vacation',
            data: labels.map((location) => {
                return followedVacations[location];
            }),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          }
        ],
    };

    return(
        <div className="reports container mx-auto border col-lg-8 col-md-12 col-sm-12">
            <Bar options={options} data={data} />
        </div>
    );
}

export default Reports;