import { CalendarOutlined, LineChartOutlined } from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Outlet />
      <div className="bottom-navigation">
        <button
          onClick={() => {
            navigate("/", { replace: true });
          }}
        >
          <CalendarOutlined style={{ fontSize: "18px" }} />
          <p>캘린더</p>
        </button>
        <button
          onClick={() => {
            navigate("/stastics", { replace: true });
          }}
        >
          <LineChartOutlined style={{ fontSize: "18px" }} />
          <p>통계</p>
        </button>
      </div>
    </div>
  );
};

export default Navigation;
