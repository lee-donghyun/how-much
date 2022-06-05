import Calendar from "../../components/Calender";
import koKr from "antd/lib/calendar/locale/ko_KR";
import {
  Button,
  Divider,
  Form,
  Input,
  List,
  message,
  Switch,
  Typography,
} from "antd";
import { FC, useEffect, useState } from "react";
import dayjs from "dayjs";
import Record from "../../components/Record";
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import db, { Record as IRecord } from "../../services/api/db";
import { useLiveQuery } from "dexie-react-hooks";
import BottomSheet from "../../components/BottomSheet";
import { BottomSheetState } from "./helper";

const CalenderPage = () => {
  const [date, setDate] = useState(dayjs());
  const [bottomSheet, setBottomSheet] = useState<BottomSheetState>(
    BottomSheetState.NONE
  );
  const [target, setTarget] = useState<null | IRecord>(null);

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

  const onSelect = (date: dayjs.Dayjs) => {
    setDate(date);
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
            <span
              style={{
                background: typeColor[item.type],
                borderRadius: 99,
                width: 4,
                height: 4,
                display: "block",
              }}
            ></span>
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
        <Button.Group>
          <Button
            onClick={() => {
              setBottomSheet(BottomSheetState.SEARCH);
            }}
          >
            <SearchOutlined />
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setBottomSheet(BottomSheetState.ADD);
            }}
          >
            <PlusOutlined />
          </Button>
        </Button.Group>
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
              onClick={() => {
                setTarget(record);
                setBottomSheet(BottomSheetState.DELETE);
              }}
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
      <EditRecordBottomSheet
        open={bottomSheet == BottomSheetState.EDIT && !!target}
        onClose={() => {
          setBottomSheet(BottomSheetState.NONE);
        }}
        target={target as IRecord}
      />

      <SearchBottomSheet
        open={bottomSheet == BottomSheetState.SEARCH}
        onClose={() => setBottomSheet(BottomSheetState.NONE)}
        setDate={setDate}
      />
      <BottomSheet
        open={bottomSheet == BottomSheetState.DELETE}
        onClose={() => {
          setBottomSheet(BottomSheetState.NONE);
        }}
        inset={40}
      >
        <div className="bottom-sheet-delete">
          <div
            className="option"
            role={"button"}
            onClick={async () => {
              try {
                if (!target?.id) {
                  throw new Error("");
                }
                setBottomSheet(BottomSheetState.EDIT);
              } catch (error) {
                message.error("다시 시도해주세요.");
                console.error(error);
              }
            }}
          >
            <EditOutlined />
            <p>수정</p>
          </div>
          <div
            className="option"
            role={"button"}
            onClick={async () => {
              try {
                if (!target?.id) {
                  throw new Error("");
                }
                await db.records.delete(target.id);
                setBottomSheet(BottomSheetState.NONE);
              } catch (error) {
                message.error("다시 시도해주세요.");
                console.error(error);
              }
            }}
          >
            <DeleteOutlined />
            <p>삭제</p>
          </div>
        </div>
      </BottomSheet>
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
          height: "88vh",
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
            } catch (error) {
              message.error("다시 시도해주세요.");
            }
          }}
          initialValues={{
            type: false,
          }}
          requiredMark={false}
        >
          <Form.Item label="종류" name="type" valuePropName="checked">
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
const EditRecordBottomSheet: FC<{
  open: boolean;
  onClose: () => any;
  target: IRecord | null;
}> = ({ open, onClose, target }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && target) {
      form.setFieldsValue({
        type: { plus: true, minus: false }[target.type],
        value: target.value,
        description: target.description,
      });
    }
  }, [open]);

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
          height: "88vh",
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
            {dayjs((target?.unix ?? 0) * 1000).format("M월 D일 내역 수정")}
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
            console.log(target);

            try {
              await db.records.put({
                id: target?.id,
                unix: target?.unix ?? 0,
                value,
                description: form.description,
                type: form.type ? "plus" : "minus",
              });
              onClose();
            } catch (error) {
              message.error("다시 시도해주세요.");
            }
          }}
          initialValues={{
            type: false,
          }}
          requiredMark={false}
        >
          <Form.Item label="종류" name="type" valuePropName="checked">
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

const SearchBottomSheet: FC<{
  open: boolean;
  onClose: () => any;
  setDate: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
}> = ({ open, onClose, setDate }) => {
  const [query, setQuery] = useState("");
  const [records, setResult] = useState<IRecord[]>([]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        db.records
          .filter((record) => record.description.includes(query))
          .toArray()
          .then((records) => {
            setResult(records);
          });
      }, 200);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [open, query]);

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      onClosed={() => {
        setQuery("");
      }}
    >
      <div style={{ height: "88vh" }}>
        <div style={{ padding: 20 }}>
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
              검색
            </div>
            <div style={{ width: 60 }}></div>
          </div>
          <Input
            placeholder="메모로 검색하세요."
            allowClear
            value={query}
            onChange={({ target: { value } }) => {
              setQuery(value);
            }}
          />
        </div>
        <div
          style={{
            height: "calc(100% - 124px)",
            overflowY: "scroll",
          }}
        >
          <List
            itemLayout="horizontal"
            className="body-scroll-lock-ignore"
            dataSource={records}
            rowKey={(record) => record.id ?? ""}
            renderItem={(record) => {
              const date = dayjs(record.unix * 1000);
              return (
                <List.Item
                  className="record"
                  onClick={() => {
                    setDate(date);
                    onClose();
                  }}
                >
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
    </BottomSheet>
  );
};

const typeColor = {
  plus: "#52c41a",
  minus: "#ff4d4f",
};
