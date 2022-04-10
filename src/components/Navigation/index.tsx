import { CalendarOutlined, LineChartOutlined } from "@ant-design/icons";
import { Outlet } from "react-router-dom";

const Navigation = () => {
  return (
    <div>
      <Outlet />
      <div className="bottom-navigation">
        <button>
          <CalendarOutlined style={{ fontSize: "18px" }} />
          <p>캘린더</p>
        </button>
        <button>
          <LineChartOutlined style={{ fontSize: "18px" }} />
          <p>통계</p>
        </button>
      </div>
    </div>
  );
};

export default Navigation;
