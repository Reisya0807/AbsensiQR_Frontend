import AttendanceServices from "./services/AttendanceService";
import AuthService from "./services/AuthService";
import EventService from "./services/EventService";
import QRService from "./services/QRService";
import UserService from "./services/UserService";
import CertificateService from "./services/CertificateService";
import PortfolioService from "./services/PortfolioService";
import PesertaService from "./services/PesertaService";

const baseurl = "http://localhost:5000/api"
const endpoints = {
    base : baseurl,
    user : `${baseurl}/users`,
    auth : `${baseurl}/auth`,
    qr : `${baseurl}/qr/generate`,
    attendance : `${baseurl}/attendance`,
    event : `${baseurl}/event`,
    certificate : `${baseurl}/certificate`,
    peserta : `${baseurl}/peserta`,
    portfolio :`${baseurl}/portfolio`
}
const userAPI = new UserService(endpoints.user);
const authAPI = new AuthService(endpoints.auth);
const qrAPI = new QRService(endpoints.qr)
const attendanceAPI = new AttendanceServices(endpoints.attendance)
const eventAPI = new EventService(endpoints.event)
const certificateAPI = new CertificateService(endpoints.certificate)
const pesertaAPI = new PesertaService(endpoints.peserta)
const portfolioAPI = new PortfolioService(endpoints.portfolio)


export {
    endpoints, 
    userAPI, 
    authAPI, 
    qrAPI, 
    attendanceAPI, 
    eventAPI, 
    certificateAPI, 
    pesertaAPI, 
    portfolioAPI
}