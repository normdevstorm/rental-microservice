import { Button, Form, Input, Radio, Select } from "antd/lib";
import { useState } from "react";
import { regex } from "../../const/regex";
import axios from "axios";
import { handleErrorMessage } from "../../helper";
import { Typography } from "antd";
import localStorageService from "../../services/localStorageService";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import withAuth from "../WithAuth";

type SizeType = Parameters<typeof Form>[0]["size"];
const { Option } = Select;

function CurrencyConvertForm() {
  const [form] = Form.useForm();
  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [outputCurrency, setOutputCurrency] = useState<any>(0);
  const [outputUnit, setOutputUnit] = useState<any>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lang, setLang] = useState<any>(
    localStorageService.getLocalStorage("lang")
  );

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  const { t } = useTranslation();

  const { Title } = Typography;

  const handleSubmitForm = async (evt: any) => {
    setIsLoading(true);
    const from = evt?.from.toUpperCase();
    const to = evt?.to.toUpperCase();
    const amount = evt?.amount;

    try {
      setIsLoading(true);
      const result = await axios.get(
        // `https://api.api-ninjas.com/v1/convertcurrency?have=${from}&want=${to}&amount=${amount}`
        `https://api.fastforex.io/convert/?from=${from}&to=${to}&amount=${amount}`,
        {
          params: {
            api_key: "aa91c1e29e-d8e6df931a-sbu0hz",
          },
        }
      );
      if (result.data) {
        setIsLoading(false);
        const rs = result.data.result[`${to}`];
        const roundedData = Math.floor(rs);
        setOutputCurrency(
          roundedData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
      }
    } catch (error: any) {
      handleErrorMessage(null, error?.response?.data?.error);
    } finally {
      setIsLoading(false);
    }
  };

  const onLanguageChange = (value: string) => {
    localStorageService.setLocalStorage("lang", value);
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center mt-5">
      <div>
        <div className={`${styles.currencyForm}`}>
          <div className="!rounded">
            <h1 className="my-10 text-3xl font-bold text-blue font-sans text-left">
              {t("currency_form_title")}
            </h1>
          </div>
          <div>
            <Form
              form={form}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              initialValues={{ size: componentSize }}
              onValuesChange={onFormLayoutChange}
              size={componentSize as SizeType}
              style={{ maxWidth: 600 }}
              onFinish={handleSubmitForm}
              name="CurrencyConvertForm"
            >
              <Form.Item label={t("form_size")} name="size">
                <Radio.Group>
                  <Radio.Button value="small">{t("small")}</Radio.Button>
                  <Radio.Button value="default">{t("default")}</Radio.Button>
                  <Radio.Button value="large">{t("large")}</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item name="lang" label={t("language")} rules={[]}>
                <Select
                  placeholder="Select a option and change input text above"
                  onChange={onLanguageChange}
                  allowClear
                  defaultValue={lang}
                >
                  <Option value="vi">{t("vietnam")}</Option>
                  <Option value="en">{t("english")}</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label={t("convert_from")}
                name={`from`}
                rules={[
                  {
                    required: true,
                    message: t("field_required"),
                  },
                ]}
              >
                <Input
                  placeholder={t("placeholder_from")}
                  className="w-[500px]"
                />
              </Form.Item>
              <Form.Item
                label={t("convert_to")}
                name={`to`}
                rules={[
                  {
                    required: true,
                    message: t("field_required"),
                  },
                ]}
              >
                <Input
                  placeholder={t("placeholder_from")}
                  onChange={(e: any) => setOutputUnit(e.target.value)}
                  className="w-[500px]"
                />
              </Form.Item>
              <Form.Item
                label={t("amount")}
                name={`amount`}
                rules={[
                  {
                    required: true,
                    message: t("field_required"),
                  },
                  {
                    pattern: regex.regexNumberInteger,
                    message: t("field_number_required"),
                  },
                ]}
              >
                <Input
                  placeholder={t("placeholder_amount")}
                  className="w-[500px]"
                />
              </Form.Item>
              <Button loading={isLoading} htmlType="submit" type="primary">
                {t("convert")}
              </Button>
            </Form>
          </div>
          <div className="flex flex-row mt-5">
            <div>
              <Title>{t("result")}: </Title>
            </div>
            <div className="pl-5">
              <Title>
                {outputCurrency}
                {` ${outputUnit.toUpperCase()}`}
              </Title>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(CurrencyConvertForm);
