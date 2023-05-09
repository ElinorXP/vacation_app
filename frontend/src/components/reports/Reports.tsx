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
            const response = await api.get('/getAllVacations');
            setApiData(response.data.vacations);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    let followedVacations:Record<string, number> = {};

    apiData.filter((vacation) => vacation.followers! > 0)
           .forEach((vacation) => {
            followedVacations[vacation.location] = vacation.followers!;
    });

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
            label: 'Followers',
            data: followedVacations,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          }
        ],
    };

    return(
        <div className="reports container mx-auto border col-lg-8 col-md-12 col-sm-12">
            {apiData.length > 0 ? <Bar options={options} data={data} /> : <p>No Vacations</p>}
        </div>
    );
}

export default Reports;