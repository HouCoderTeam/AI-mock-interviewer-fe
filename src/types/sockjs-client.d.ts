// sockjs-client không có type chính thức, khai báo tối thiểu để dùng với @stomp/stompjs.
// Dùng bản dist/sockjs vì entry chính (lib/entry.js) tham chiếu biến `global`
// khiến trình duyệt crash "global is not defined" (Vite không polyfill biến này).
declare module "sockjs-client/dist/sockjs" {
  const SockJS: any;
  export default SockJS;
}
