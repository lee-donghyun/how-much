import { DownOutlined, SettingOutlined } from "@ant-design/icons";
import {
  Statistic,
  Button,
  message,
  Row,
  Radio,
  Select,
  Divider,
  List,
} from "antd";
import dayjs from "dayjs";
import { useLiveQuery } from "dexie-react-hooks";
import { FC, useState } from "react";
import Record from "../../components/Record";
import db from "../../services/api/db";
import { FILTER, SORT } from "./helper";

const StasticsPage: FC = () => {
  const [date, setDate] = useState(dayjs());
  const [filter, setFilter] = useState<FILTER>(FILTER.ALL);
  const [sort, setSort] = useState<SORT>(SORT.UNIX);

  const records = useLiveQuery(
    () =>
      db.records
        .where("unix")
        .between(
          date.clone().startOf("month").unix(),
          date.clone().add(1, "month").startOf("month").unix()
        )
        .toArray(),
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          padding: "0 20px",
        }}
      >
        <Statistic
          title="수입"
          value={plus}
          valueStyle={{ color: "#389e0d", fontSize: "22px" }}
          suffix="원"
          loading={!records}
        />
        <Statistic
          title="지출"
          value={minus}
          valueStyle={{ color: "#cf1322", fontSize: "22px" }}
          suffix="원"
          loading={!records}
        />
      </div>
      <Divider style={{ marginBottom: 0 }} />
      <Row
        justify="space-between"
        style={{
          padding: "24px 20px",
          position: "sticky",
          top: 72,
          background: "white",
          zIndex: 10,
        }}
      >
        <Radio.Group
          value={filter}
          onChange={({ target: { value } }) => setFilter(value)}
        >
          <Radio.Button value={FILTER.ALL}>전체</Radio.Button>
          <Radio.Button value={FILTER.PLUS}>수입</Radio.Button>
          <Radio.Button value={FILTER.MINUS}>지출</Radio.Button>
        </Radio.Group>
        <Select style={{ width: 120 }} value={sort} onChange={setSort}>
          <Select.Option value={SORT.VALUE_DESC}>금액 높은 순</Select.Option>
          <Select.Option value={SORT.VALUE}>금액 낮은 순</Select.Option>
          <Select.Option value={SORT.UNIX_DESC}>최신 순</Select.Option>
          <Select.Option value={SORT.UNIX}>오래된 순</Select.Option>
        </Select>
      </Row>
      <div
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom) + 80px)",
        }}
      >
        <List
          itemLayout="horizontal"
          dataSource={records
            ?.filter((record) =>
              filter == FILTER.ALL ? true : record.type == filter
            )
            .sort((a, b) => {
              switch (sort) {
                case SORT.UNIX:
                  return a.unix - b.unix;
                case SORT.UNIX_DESC:
                  return b.unix - a.unix;
                case SORT.VALUE:
                  return a.value - b.value;
                case SORT.VALUE_DESC:
                  return b.value - a.value;
              }
            })}
          rowKey={(record) => record.id ?? ""}
          renderItem={(record) => {
            const date = dayjs(record.unix * 1000);
            return (
              <List.Item className="record" onClick={() => {}}>
                <Record
                  mode={record.type}
                  title={`${record.value.toLocaleString()}원`}
                  description={`${record.description} - ${date.format(
                    "YY/MM/DD"
                  )}`}
                />
              </List.Item>
            );
          }}
        />
      </div>
    </div>
  );
};

export default StasticsPage;
