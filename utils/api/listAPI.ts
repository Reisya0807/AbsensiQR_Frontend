import AttendanceService from "./services/AttendanceService";
import AuthService from "./services/AuthService";
import EventService from "./services/EventService";
import QRService from "./services/QRService";
import UserService from "./services/UserService";
import CertificateService from "./services/CertificateService";
import PortfolioService from "./services/PortfolioService";
import PesertaService from "./services/PesertaService";

const baseurl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000/api"
const endpoints = {
    base: baseurl,
    user: `${baseurl}/users`,
    auth: `${baseurl}/auth`,
    qr: `${baseurl}/qr/generate`,
    attendance: `${baseurl}/attendance`,
    event: `${baseurl}/event`,
    certificate: `${baseurl}/certificate`,
    peserta: `${baseurl}/peserta`,
    portfolio: `${baseurl}/portfolio`,
    rundown: `${baseurl}/rundown`,
}
const userAPI = new UserService(endpoints.user);
const authAPI = new AuthService(endpoints.auth);
const qrAPI = new QRService(endpoints.qr)
const attendanceAPI = new AttendanceService(endpoints.attendance)
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
    portfolioAPI,
}
