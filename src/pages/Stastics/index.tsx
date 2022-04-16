import { DownOutlined, SettingOutlined } from "@ant-design/icons";
import { Statistic, Button, message, Col, Row } from "antd";
import dayjs from "dayjs";
import { useLiveQuery } from "dexie-react-hooks";
import { FC, useState } from "react";
import db from "../../services/api/db";

const StasticsPage: FC = () => {
  const [date, setDate] = useState(dayjs());

  const records = useLiveQuery(
    () =>
      db.records
        .where("unix")
        .between(
          date.clone().startOf("month").unix(),
          date.clone().add(1, "month").startOf("month").unix()
        )
        .sortBy("unix"),
    [date]
  );
  const [plus, minus] = records?.reduce(
    ([plus, minus], record) => {
      if (record.type == "plus") {
        return [plus + record.value, minus];
      } else {
        return [plus, minus + record.value];
      }
    },
    [0, 0]
  ) ?? [0, 0];

  return (
    <div>
      <div style={{ height: "calc(env(safe-area-inset-top) + 72px)" }}></div>
      <div className="top-navigation">
        <label style={{ margin: 0, display: "flex", alignItems: "center" }}>
          <input
            type="month"
            name="month"
            value={date.format("YYYY-MM")}
            onChange={({ target: { value } }) => setDate(dayjs(value))}
          />
          <DownOutlined style={{ marginLeft: "4px" }} />
        </label>
        <Button
          onClick={() => {
            message.info("해당 기능 준비중입니다.", 0.6);
          }}
        >
          <SettingOutlined />
        </Button>
      </div>
      <div style={{ padding: 20 }}>
        <Statistic
          title={`${date.get("M") + 1}월 총액`}
          value={plus - minus}
          valueStyle={{
            color: plus - minus > 0 ? "#389e0d" : "#cf1322",
            fontSize: "28px",
          }}
          suffix="원"
          loading={!records}
        />
      </div>
      <Row gutter={20} style={{ padding: 20 }}>
        <Col span={12}>
          <Statistic
            title="수입"
            value={plus}
            valueStyle={{ color: "#389e0d", fontSize: "22px" }}
            suffix="원"
            loading={!records}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="지출"
            value={minus}
            valueStyle={{ color: "#cf1322", fontSize: "22px" }}
            suffix="원"
            loading={!records}
          />
        </Col>
      </Row>
    </div>
  );
};

export default StasticsPage;
