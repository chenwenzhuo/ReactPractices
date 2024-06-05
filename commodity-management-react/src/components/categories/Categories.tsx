import {FC, useEffect, useState} from "react";
import {Card, Form, Select} from "antd";

import {reqCategory1, reqCategory2, reqCategory3} from "@/api/product/category";
import {CategoriesList, CategoryResponseData} from "@/api/product/category/types.ts";

const FormItem = Form.Item;

interface CategoriesProps {
  disabled: boolean;
  setCategories: Function;
}

const Categories: FC<CategoriesProps> = (props) => {
  const {setCategories, disabled} = props;
  const [cateForm] = Form.useForm();
  const [optionsCate1, setOptionsCate1] = useState<CategoriesList>([]); // 一级分类选项
  const [optionsCate2, setOptionsCate2] = useState<CategoriesList>([]); // 二级分类选项
  const [optionsCate3, setOptionsCate3] = useState<CategoriesList>([]); // 三级分类选项
  const [selectionCate1, setSelectionCate1] = useState<number | null>(null); // 一级分类选中项
  const [selectionCate2, setSelectionCate2] = useState<number | null>(null); // 二级分类选中项
  const [selectionCate3, setSelectionCate3] = useState<number | null>(null); // 三级分类选中项

  async function getCategory1() {
    const response: CategoryResponseData = await reqCategory1();
    if (response.code === 200) {
      setOptionsCate1(response.data);
    }
  }

  async function getCategory2() {
    const response: CategoryResponseData = await reqCategory2(selectionCate1 as number);
    if (response.code === 200) {
      setOptionsCate2(response.data);
    }
  }

  async function getCategory3() {
    const response: CategoryResponseData = await reqCategory3(selectionCate2 as number);
    if (response.code === 200) {
      setOptionsCate3(response.data);
    }
  }

  function onChangeCate1(value: number) {
    setSelectionCate1(value);
  }

  function onChangeCate2(value: number) {
    setSelectionCate2(value);
  }

  function onChangeCate3(value: number) {
    setSelectionCate3(value);
  }

  useEffect(() => {
    getCategory1();
  }, []);

  useEffect(() => {
    // 重置二级、三级分类相关state
    setSelectionCate2(null);
    setSelectionCate3(null);
    setOptionsCate2([]);
    setOptionsCate3([]);
    // 重置二级、三级分类表单
    cateForm.setFieldsValue({cate2: null, cate3: null});
    setCategories(selectionCate1, selectionCate2, selectionCate3); // 向父组件同步三个分类的选项值
    if (selectionCate1 !== null) {
      getCategory2();
    }
  }, [selectionCate1]);

  useEffect(() => {
    // 重置三级分类相关state
    setSelectionCate3(null);
    setOptionsCate3([]);
    // 重置三级分类表单
    cateForm.setFieldsValue({cate3: null});
    setCategories(selectionCate1, selectionCate2, selectionCate3); // 向父组件同步三个分类的选项值
    if (selectionCate2 !== null) {
      getCategory3();
    }
  }, [selectionCate2]);

  useEffect(() => {
    setCategories(selectionCate1, selectionCate2, selectionCate3); // 向父组件同步三个分类的选项值
  }, [selectionCate3]);

  return (
    <main className={"categories-component"}>
      <Card style={{width: "100%", height: "25%"}}>
        <Form
          form={cateForm}
          name={"category"}
          layout={"inline"}
          autoComplete={"off"}
          disabled={disabled}
        >
          <FormItem label={"一级分类"} name={"cate1"}>
            <Select options={optionsCate1.map(item => ({label: item.name, value: item.id}))}
                    placeholder={"请选择"}
                    style={{width: 300}}
                    onChange={onChangeCate1}/>
          </FormItem>
          <FormItem label={"二级分类"} name={"cate2"}>
            <Select options={optionsCate2.map(item => ({label: item.name, value: item.id}))}
                    placeholder={"请选择"}
                    style={{width: 300}}
                    onChange={onChangeCate2}/>
          </FormItem>
          <FormItem label={"三级分类"} name={"cate3"}>
            <Select options={optionsCate3.map(item => ({label: item.name, value: item.id}))}
                    placeholder={"请选择"}
                    style={{width: 300}}
                    onChange={onChangeCate3}/>
          </FormItem>
        </Form>
      </Card>
    </main>
  );
};

export default Categories;
