import practice1 from "../../../assets/images/guides/image13.png";
import practice2 from "../../../assets/images/guides/image6.png";
import button1 from "../../../assets/images/guides/image12.png";
import practice3 from "../../../assets/images/guides/image18.png";
import practice4 from "../../../assets/images/guides/image1.png";
import practice5 from "../../../assets/images/guides/image14.png";
import practice6 from "../../../assets/images/guides/image17.png";
import practice7 from "../../../assets/images/guides/image9.png";
import practice8 from "../../../assets/images/guides/image4.png";
import practice9 from "../../../assets/images/guides/image7.png";
import practice10 from "../../../assets/images/guides/image3.png";
import practice11 from "../../../assets/images/guides/image16.png";
import button2 from "../../../assets/images/guides/image5.png";
import practice12 from "../../../assets/images/guides/image11.png";
import button3 from "../../../assets/images/guides/image10.png";
export default function HelpPractice() {
  return (
    <div style={{ paddingBottom: 20, paddingLeft: 20, paddingRight: 20 }}>
      <p>
        Để truy cập vào trang Luyện tập, người dùng bấm <b>Luyện tập</b> trên
        thanh sidebar bên trái giao diện hệ thống.
      </p>
      <img src={practice1} width={"100%"} />
      <p>
        Người dùng cần khởi tạo bộ lọc để chọn nội dung luyện tập đúng nhu cầu.
        Đầu tiên, tick chọn môn học muốn luyện tập, sau đó chọn các nội dung
        muốn ôn tập, và chọn số câu hỏi tương ứng mỗi nội dung.
      </p>
      <img src={practice2} width={"100%"} />
      <p>
        Sau khi thiết lập xong và bấm Sau khi thiết lập xong và bấm{" "}
        <img
          src={button1}
          style={{ display: "inline-block", height: "30px" }}
        />
        , hệ thống sẽ hiển thị trang làm bài, với môn học cùng các nội dung đã
        chọn tương ứng.
      </p>
      <img src={practice3} width={"100%"} />
      <p>
        Trong quá trình làm bài, người dùng vẫn có thể thiết lập lại bộ lọc để
        thay đổi nội dung đang luyện tập. Ngoài ra có thể ấn nút thu gọn thanh
        điều hướng câu hỏi để giao diện làm bài được mở rộng hơn.
      </p>
      <img src={practice4} width={"100%"} />
      <p>
        Các thao tác của người dùng sẽ được lưu lại trên thanh điều hướng câu
        hỏi này.{" "}
      </p>
      <img src={practice5} width={"100%"} />
      <p>
        Đối với những câu hỏi mà người dùng chưa chắc chắn, muốn xem lại, có thể
        ấn nút Bookmark. Hệ thống sẽ ghi nhận và tăng tần suất xuất hiện các câu
        hỏi tương tự cho người dùng cho những lần ôn tập tiếp theo.
      </p>
      <img src={practice6} width={"100%"} />
      <p>
        Với những câu hỏi người dùng không muốn hệ thống tập trung đề xuất nhiều
        nữa (do đã từng Bookmark), người dùng có thể ấn lại nút Bookmark để hệ
        thống ghi nhận và giảm tần suất xuất hiện của các câu hỏi đó.
      </p>
      <img src={practice7} width={"100%"} />
      <p>
        Đối với những câu hỏi mà người dùng đã nắm chắc, có thể đánh dấu ‘Đã
        thành thạo’ để hệ thống hạn chế đề xuất những câu hỏi này trong tương
        lai.
      </p>
      <img src={practice8} width={"100%"} />
      <p>
        Người dùng cũng có thể hủy chế độ Đã thành thạo đối với 1 câu hỏi, khi
        đó, hệ thống sẽ tiếp tục đề xuất câu hỏi đó sau này.
      </p>
      <img src={practice9} width={"100%"} />
      <p>
        Nếu người dùng phát hiện câu hỏi có lỗi, có thể báo lỗi để quản trị viên
        hệ thống xem xét lại. Người dùng sẽ bấm nút báo lỗi trên câu hỏi, sau đó
        nhập nội dung lỗi và gửi đi.
      </p>
      <img src={practice10} width={"100%"} />
      <p>
        Ngoài ra, người dùng cũng có thể bình luận vào các câu hỏi, cũng như xem
        được các bình luận về câu hỏi đó.
      </p>
      <img src={practice11} width={"100%"} />
      <p>
        Sau khi làm xong bài, người dùng bấm nút{" "}
        <img
          src={button2}
          style={{ display: "inline-block", height: "30px" }}
        />{" "}
        trên thanh điều hướng câu hỏi để xem điểm số mình đạt được. Hệ thống sẽ
        hiển thị kết quả làm bài.
      </p>
      <img src={practice12} width={"100%"} />
      <p>
        Người dùng có thể bấm{" "}
        <img
          src={button3}
          style={{ display: "inline-block", height: "30px" }}
        />{" "}
        để tiếp tục luyện tập với các câu hỏi đã thiết lập ở bộ lọc.
      </p>
    </div>
  );
}
