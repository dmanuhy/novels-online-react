import Pagination from "./Pagination/Pagination";
import GenreList from './GenreList';
import "../assets/css/Home.scss"
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import moment from 'moment/moment';
import "moment/locale/vi";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PAGE_SIZE = 10;

const Home = () => {
    const [genres, setGenres] = useState([]);
    const [novels, setNovels] = useState([]);
    const [novelsGenre, setNovelsGenre] = useState([])
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        axios.get(`/novels`)
            .then(res => {
                setNovels(res.data)
            })
            .catch(err => console.error(err));
        axios.get(`/genres`)
            .then(res => {
                setGenres(res.data)
            })
            .catch(err => console.error(err));
        axios.get(`/novelGenre`)
            .then(res => {
                setNovelsGenre(res.data)
            })
            .catch(err => console.log(err))
    }, [])

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PAGE_SIZE;
        const lastPageIndex = firstPageIndex + PAGE_SIZE;
        return novels.sort((a, b) => {
            return -a.chapters[a.chapters.length - 1].uploadedDate.localeCompare(b.chapters[b.chapters.length - 1].uploadedDate)
        }).slice(firstPageIndex, lastPageIndex);
    }, [currentPage, novels]);


    return (
        <>
            <div className="home-body py-4">
                <div className="container home-container">
                    <div className="home-section row g-3 text-center mb-5">
                        <div className="title text-start text-uppercase col-12">
                            <span>Truyện HOT </span>
                            <FontAwesomeIcon icon="fa-solid fa-fire" />
                        </div>
                        {
                            novels && novels.filter(novel => novel.isHot === true).slice(0, 12).map((item, index) => {
                                return (
                                    <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={index}>
                                        <Link className="novel position-relative" to={`/novels/${item.id}`}>
                                            <img className="card-img-top novel-image img-fluid" src={item.image}
                                                alt="..." />
                                            <div className="novel-name py-1 text-center">
                                                <span>{item.name}</span>
                                            </div>
                                        </Link>
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className="home-section row g-3 text-center mb-4">
                        <div className="text-start col-12 col-lg-9">
                            <div className="title text-uppercase">Truyện Mới Cập Nhật</div>
                            {
                                currentTableData && currentTableData.map((item, index) => {
                                    return (
                                        <div className="new-novel row" key={index}>
                                            <Link to={`/novels/${item.id}`} className="new-novel-name text-decoration-none text-dark col-9 col-lg-5">{item.name}</Link>
                                            <div className="d-none d-lg-block new-novel-genre col-3">
                                                {
                                                    novelsGenre.filter((novel) => novel.novelId === item.id).map((novelGenre) => {
                                                        return (
                                                            <span key={novelGenre.genreId}>
                                                                [<Link to={`/genres/${novelGenre.genreId}`} className=' text-decoration-none text-dark'>{genres.find((genre) => genre.id === novelGenre.genreId).name}</Link>]<span> </span>
                                                            </span>
                                                        )
                                                    })
                                                }
                                            </div>
                                            <Link to={`/novels/${item.id}/chapters/${item.chapters[item.chapters.length - 1].id}`} className="new-novel-chapter text-decoration-none col-3 col-lg-2">Chương {item.chapters[item.chapters.length - 1].id}</Link>
                                            <div className="d-none d-lg-block updated-time col-2">{moment(item.chapters[item.chapters.length - 1].uploadedDate).locale("vi").fromNow()}</div>
                                        </div>
                                    )
                                })
                            }
                            <div className="d-flex justify-content-center mt-2">
                                <Pagination
                                    className="pagination-bar"
                                    currentPage={currentPage}
                                    totalCount={novels.length}
                                    pageSize={PAGE_SIZE}
                                    onPageChange={page => setCurrentPage(page)}
                                />
                            </div>
                        </div>
                        <div className="col-12 col-lg-3 ps-3 d-none d-lg-block">
                            <GenreList genres={genres} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home;