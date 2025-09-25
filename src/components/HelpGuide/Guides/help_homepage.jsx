import login1 from "../../../assets/images/guides/image15.png";
import login2 from "../../../assets/images/guides/image20.png";
import login3 from "../../../assets/images/guides/image8.png";
import login4 from "../../../assets/images/guides/image19.png";
import login5 from "../../../assets/images/guides/image2.png";
export default function HelpHomepage() {
  return (
    <div style={{ paddingBottom: 20, paddingLeft: 20, paddingRight: 20 }}>
      <p>
        Tại trang đăng nhập, người dùng có thể đăng nhập (hoặc đăng ký) bằng
        email của NEU để có thể truy cập hệ thống.
      </p>
      <img src={login1} width={"100%"} />
      <p>
        Trang đăng nhập hiển thị khi người dùng bấm Đăng nhập hoặc Bắt đầu ngay:
      </p>
      <img src={login2} width={"100%"} />
      <p>
        Trong trường hợp đã có tài khoản nhưng quên mật khẩu, người dùng có thể
        bấm <b>Quên mật khẩu</b> để đặt lại mật khẩu.
      </p>
      <img src={login3} width={"100%"} />
      <p>
        Trong trường hợp chưa có tài khoản trên hệ thống, người dùng vẫn có thể
        sử dụng tính năng <b>Đăng nhập với Microsoft NEU</b> để tạo được tài
        khoản. Hệ thống khuyến khích người dùng sử dụng chức năng{" "}
        <b>Đăng nhập với Microsoft NEU</b> này để thuận tiện cho việc ôn tập,
        thi cử.
      </p>
      <img src={login4} width={"100%"} />
      <p>
        Sau khi đăng nhập thành công, người dùng sẽ truy cập được vào hệ thống,
        xem được trang Dashboard.
      </p>
      <img src={login5} width={"100%"} />
    </div>
  );
}
