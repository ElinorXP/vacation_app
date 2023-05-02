import react, {useState, useEffect} from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import {Link} from 'react-router-dom';

import TablePagination from '@mui/material/TablePagination';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button/Button';
import { Delete, Edit, Favorite } from '@mui/icons-material';

import {getTokenFromLocalStorage, useAuthUser } from '../../utils/User';
import {IVacation} from '../../../../shared/IVacation';
import {IVacationsData} from '../../../../shared/IVacationsData';
import {api} from '../apiUrl';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import {IFollower} from '../../../../shared/IFollower'


const Home = () => {
    const [data, setData] = useState<IVacationsData>();
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [followedMode, setFollowedMode] = useState<boolean>(false);

    const user = useAuthUser();

    const showVacations = async () => {
        try{
            const response = await api.get(`/vacations?followedMode=${followedMode}&page=${currentPage}`);
            setData(response.data);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        showVacations();
    }, [currentPage, followedMode]);

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
      ) => {
        setCurrentPage(newPage);
    };

    const Follow = ({vacation}: {vacation: IVacation}) => {
        enum eState {
            FOLLOWING = 'error',
            NOT_FOLLOWING = 'info',
            // error/info = colors of mui
        }
        const [followState, setFollowState] = useState<eState>(vacation.isUserFollowing! ? eState.FOLLOWING : eState.NOT_FOLLOWING);
        const [followersCount, setFollowersCount] = useState<number>(vacation.followers!);

        const onClick = async (vacation:IVacation) => {
            const follower:IFollower = {
                userID: user?.id!,
                vacationID: vacation.id!
            }

            if (followState === eState.NOT_FOLLOWING) {
                const response = await api.post('/follow', follower);
                if (response.data.result === "success") {
                    setFollowState(eState.FOLLOWING);
                    setFollowersCount(followersCount + 1);
                }
            } else {
                const response = await api.post('/unfollow', follower);
                if (response.data.result === "success") {
                    setFollowState(eState.NOT_FOLLOWING);
                    setFollowersCount(followersCount - 1);
                }
            }
        }

        return (<>
        {!user?.isAdmin && <IconButton
            aria-label="add to favorites"
            onClick={() => {
                onClick(vacation);
            }}
            color={followState}><Favorite/>
        </IconButton>}
        <>{followersCount} Followers</>
        </>);
    }

    const FollowingFilter = () => {
        return(<>{!user?.isAdmin && <Button variant="outlined" onClick={() => {
            setFollowedMode(!followedMode);
        }}>{followedMode ? "Show All" : "Favorites"}</Button>}</>);
    }

    const deleteVacation = async (id: number) => {
        try{
            const response = await api.delete(`/vacations/${id}`);
            if (response.data.result === 'success') {
                showVacations();
            }
        }catch(err){
            console.log(err);
        }
    }

    return(
        <div className="add-vacation mx-auto border w-50 container">
            <h1 className="text-center">Home</h1>

            <FollowingFilter />

            <TablePagination
                component="div"
                count={data?.totalCount || 0}
                page={currentPage}
                onPageChange={handleChangePage}
                rowsPerPage={4}
                onRowsPerPageChange={() => {}}
            />

            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                {data?.vacations.length === 0 && "No Followed Vacations"}
                {data?.vacations.map((obj:IVacation) => (
                    <Grid key={obj.id!} item xs={6}>
                        <Card>
                            <CardHeader
                                title={obj.location}
                                subheader={obj.vacationDescription}
                                action={
                                    <CardActions disableSpacing={true}>
                                        {user?.isAdmin &&
                                        <Link to={`/add-vacation?id=${obj.id}`}>
                                            <IconButton aria-label="edit">
                                                <Edit />
                                            </IconButton >
                                        </Link>}
                                        {user?.isAdmin && <IconButton onClick={() => {deleteVacation(obj.id!)}} aria-label="delete">
                                            <Delete/>
                                        </IconButton>}
                                    </CardActions>
                                }
                            />
                            <CardMedia
                                component="img"
                                height="194"
                                image={obj.image}
                                alt={obj.location}
                            />
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    Price: {obj.price}₪<br/>
                                    Start Date: {obj.startDate.split("T")[0].split("-").reverse().join("/")}<br/>
                                    End Date: {obj.endDate.split("T")[0].split("-").reverse().join("/")}<br/>
                                </Typography>
                            </CardContent>
                            <CardActions disableSpacing>
                            <Follow vacation={obj} />
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default Home;