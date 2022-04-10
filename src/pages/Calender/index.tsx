import Calendar from "../../components/Calender";
import koKr from "antd/lib/calendar/locale/ko_KR";
import {
  Badge,
  Button,
  Divider,
  Form,
  Input,
  List,
  message,
  Switch,
  Typography,
} from "antd";
import { FC, useRef, useState } from "react";
import dayjs from "dayjs";
import Record from "../../components/Record";
import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import db, { Record as IRecord } from "../../services/api/db";
import { useLiveQuery } from "dexie-react-hooks";
import BottomSheet from "../../components/BottomSheet";
import useLongTouch from "../../services/hooks/useLongClick";
import { BottomSheetState } from "./helper";

const CalenderPage = () => {
  const [date, setDate] = useState(dayjs());
  const [bottomSheet, setBottomSheet] = useState<BottomSheetState>(
    BottomSheetState.NONE
  );
  const [target, setTarget] = useState<null | IRecord>(null);
  const listRef = useRef<HTMLDivElement>(null);

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

  const onLongTouch = useLongTouch<HTMLDivElement>(
    async (_, record: IRecord) => {
      if (window.confirm(`${record.description}을(를) 삭제할까요?`)) {
        try {
          if (!record.id) {
            throw new Error("");
          }
          await db.records.delete(record.id);
        } catch (error) {
          message.error("다시 시도해주세요.");
          console.error(error);
        }
      }
    }
  );

  const onSelect = (date: dayjs.Dayjs) => {
    setDate(date);
    listRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const dateCellRender = (value: dayjs.Dayjs) => {
    const listData =
      records?.filter((record) =>
        dayjs(record.unix * 1000).isSame(value, "date")
      ) ?? [];
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.id ?? ""}>
            <Badge color={typeColor[item.type]} />
          </li>
        ))}
      </ul>
    );
  };

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
          type="primary"
          onClick={() => {
            setBottomSheet(BottomSheetState.ADD);
          }}
        >
          <PlusOutlined />
        </Button>
      </div>
      <Calendar
        locale={koKr}
        value={date}
        headerRender={() => <></>}
        dateCellRender={dateCellRender}
        onSelect={onSelect}
      />
      <Divider />
      <Typography.Title
        level={4}
        style={{
          padding: "12px 20px 0",
          margin: 0,
        }}
      >
        {date.format("YYYY년 M월 D일")}
      </Typography.Title>
      <div
        style={{
          paddingTop: 20,
          paddingBottom: "calc(env(safe-area-inset-bottom) + 80px)",
        }}
        ref={listRef}
      >
        <List
          itemLayout="horizontal"
          dataSource={
            records?.filter((record) =>
              dayjs(record.unix * 1000).isSame(date, "date")
            ) ?? []
          }
          rowKey={(record) => record.id ?? ""}
          renderItem={(record) => (
            <List.Item
              className="record"
              onTouchStart={onLongTouch.onTouchStart}
              onTouchEnd={(e) => onLongTouch.onTouchEnd(e, record)}
            >
              <Record
                mode={record.type}
                title={`${record.value.toLocaleString()}원`}
                description={record.description}
              />
            </List.Item>
          )}
        />
      </div>
      <RecordBottomSheet
        open={bottomSheet == BottomSheetState.ADD}
        onClose={() => {
          setBottomSheet(BottomSheetState.NONE);
        }}
        target={date}
      />
    </div>
  );
};

export default CalenderPage;

const RecordBottomSheet: FC<{
  open: boolean;
  onClose: () => any;
  target: dayjs.Dayjs;
}> = ({ open, onClose, target }) => {
  const [form] = Form.useForm();

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      onClosed={() => {
        form.resetFields();
      }}
    >
      <div
        style={{
          height: "96vh",
          padding: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Button type="text" danger onClick={onClose}>
            닫기
          </Button>
          <div
            style={{
              fontSize: "16px",
              fontWeight: 500,
            }}
          >
            {target.format("M월 D일 내역 추가")}
          </div>
          <Button
            type="text"
            onClick={() => {
              form.submit();
            }}
          >
            저장
          </Button>
        </div>
        <Form
          layout="horizontal"
          form={form}
          onFinish={async (form) => {
            const value = Number(form.value);
            if (Number.isNaN(value)) {
              return message.error("반드시 숫자로 입력해주세요.");
            }
            try {
              await db.records.add({
                unix: target.unix(),
                value,
                description: form.description,
                type: form.type ? "plus" : "minus",
              });
              onClose();
              message.success("저장되었습니다.");
            } catch (error) {
              message.error("다시 시도해주세요.");
            }
          }}
          initialValues={{
            type: false,
          }}
          requiredMark={false}
        >
          <Form.Item label="종류" name="type">
            <Switch
              className="record-type"
              checkedChildren="수입"
              unCheckedChildren="지출"
            />
          </Form.Item>
          <Form.Item
            label="금액"
            name="value"
            rules={[{ required: true, message: "반드시 입력해주세요." }]}
          >
            <Input inputMode="numeric" addonAfter="원" />
          </Form.Item>
          <Form.Item
            label="메모"
            name="description"
            rules={[{ required: true, message: "반드시 입력해주세요." }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </div>
    </BottomSheet>
  );
};

const typeColor = {
  plus: "green",
  minus: "red",
};
