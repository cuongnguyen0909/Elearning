import React, { FC, useEffect, useState } from 'react';
import { styles } from '../../../../utils/style';
import { useGetAllCategoriesQuery } from '../../../../../redux/features/category/categoryApi';

interface CourseInfomationProps {
  courseInfo: any;
  setCourseInfo: any;
  active: number;
  setActive: any;
  isEdit?: boolean;
}

const CourseInfomation: FC<CourseInfomationProps> = (props) => {
  const { courseInfo, setCourseInfo, active, setActive, isEdit } = props;
  const [dragging, setDragging] = useState(false);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setActive(active + 1);
  };
  const { data: categoriesData } = useGetAllCategoriesQuery(
    {},
    {
      refetchOnMountOrArgChange: true
    }
  );
  const categories = categoriesData?.categories;
  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          setCourseInfo({
            ...courseInfo,
            thumbnail: reader.result
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setCourseInfo({
          ...courseInfo,
          thumbnail: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (categories && categories.length > 0 && !courseInfo.category) {
      setCourseInfo({
        ...courseInfo,
        category: categories[0]._id
      });
    }
  }, [categories, courseInfo, setCourseInfo]);
  return (
    <div className="m-auto mt-24 w-[80%]">
      <form onSubmit={handleSubmit} className={`${styles.label}`}>
        <div>
          <label htmlFor="">Tên khóa học</label>
          <input
            type="text"
            name=""
            required
            value={courseInfo.title}
            onChange={(e: any) =>
              setCourseInfo({
                ...courseInfo,
                title: e.target.value
              })
            }
            id="title"
            placeholder="Nhập tên khóa học..."
            className={`${styles.input}`}
          />
        </div>
        <br />
        <div className="mb-2">
          <label htmlFor="" className={`${styles.label}`}>
            Mô tả khóa học
          </label>
          <textarea
            name=""
            id=""
            cols={30}
            rows={8}
            placeholder="Nhập mô tả khóa học..."
            className={`${styles.input} !h-min !py-2`}
            value={courseInfo?.description}
            onChange={(e) =>
              setCourseInfo({
                ...courseInfo,
                description: e.target.value
              })
            }
          />
        </div>
        <br />
        <div className="flex w-full justify-between">
          <div className="w-[45%]">
            <label htmlFor="" className={`${styles.label}`}>
              Giá bán
            </label>
            <input
              type="number"
              name=""
              required
              value={courseInfo.price}
              onChange={(e: any) =>
                setCourseInfo({
                  ...courseInfo,
                  price: e.target.value
                })
              }
              id="price"
              placeholder="Nhập giá bán khóa học..."
              className={`${styles.input}`}
            />
          </div>
          <div className="w-[50%]">
            <label htmlFor="" className={`${styles.label}`}>
              Giá gốc
            </label>
            <input
              type="number"
              name=""
              required
              value={courseInfo.estimatedPrice}
              onChange={(e: any) =>
                setCourseInfo({
                  ...courseInfo,
                  estimatedPrice: e.target.value
                })
              }
              id="estimatedPrice"
              placeholder="Nhập giá gốc khóa học..."
              className={`${styles.input}`}
            />
          </div>
        </div>
        <br />
        <div className="flex w-full justify-between">
          <div className="w-[45%]">
            <label htmlFor="" className={`${styles.label}`}>
              Thẻ
            </label>
            <input
              type="text"
              required
              name=""
              value={courseInfo.tags}
              onChange={(e: any) =>
                setCourseInfo({
                  ...courseInfo,
                  tags: e.target.value
                })
              }
              id="tags"
              placeholder="Nhập tags cho khóa học..."
              className={`${styles.input}`}
            />
          </div>
          <div className="w-[50%]">
            <label htmlFor="" className={`${styles.label}`}>
              Thể loại
            </label>
            {/* <input
                            type="text"
                            required
                            name=""
                            value={courseInfo.tags}
                            onChange={(e: any) =>
                                setCourseInfo({
                                    ...courseInfo,
                                    tags: e.target.value
                                })
                            }
                            id="tags"
                            placeholder="Nhập tags cho khóa học..."
                            className={`${styles.input}`}
                        /> */}
            {isEdit ? (
              <select
                name=""
                id=""
                className={`${styles.input} border !bg-slate-900`}
                onChange={(e: any) => {
                  setCourseInfo({
                    ...courseInfo,
                    category: e.target.value
                  });
                }}
              >
                {categories?.map((category: any, index: number) => (
                  <option
                    key={index}
                    value={category?._id}
                    selected={category?._id.toString() === courseInfo.category.toString()}
                  >
                    {category.title}
                  </option>
                ))}
              </select>
            ) : (
              <select
                name=""
                id=""
                className={`${styles.input} border !bg-slate-900`}
                onChange={(e: any) => {
                  setCourseInfo({
                    ...courseInfo,
                    category: e.target.value
                  });
                }}
              >
                {categories?.map((category: any, index: number) => (
                  <option key={index} value={category._id}>
                    {category.title}
                  </option>
                ))}
              </select>
            )}
            {/* <select name="" id="" className={`${styles.input} border !bg-slate-900`}>
                            {categories?.map((category: any, index: number) =>
                                isEdit ? (
                                    <option
                                        key={index}
                                        value={category._id}
                                        selected={category._id === courseInfo.category}
                                    >
                                        {category.name}
                                    </option>
                                ) : (
                                    <option key={index} value={category._id}>
                                        {category.name}
                                    </option>
                                )
                            )}
                        </select> */}
          </div>
        </div>
        <br />
        <div className="flex w-full justify-between">
          <div className="w-[45%]">
            <label htmlFor="" className={`${styles.label}`}>
              Cấp độ
            </label>
            <input
              type="text"
              name=""
              required
              value={courseInfo.level}
              onChange={(e: any) =>
                setCourseInfo({
                  ...courseInfo,
                  level: e.target.value
                })
              }
              id="level"
              placeholder="Nhập level khóa học..."
              className={`${styles.input}`}
            />
          </div>
          <div className="w-[50%]">
            <label htmlFor="" className={`${styles.label}`}>
              Đường dẫn demo
            </label>
            <input
              type="text"
              name=""
              required
              value={courseInfo.demoUrl}
              onChange={(e: any) =>
                setCourseInfo({
                  ...courseInfo,
                  demoUrl: e.target.value
                })
              }
              id="demoUrl"
              placeholder="Nhập demo url khóa học..."
              className={`${styles.input}`}
            />
          </div>
        </div>
        <br />
        <div className="flex w-full flex-col">
          <input type="file" accept="image/*" id="file" className="hidden" onChange={handleFileChange} />
          <label
            htmlFor="file"
            className={`flex min-h-[10vh] w-[100%] items-center justify-center border border-[#00000026] p-3 dark:border-white ${dragging ? 'bg-blue-500' : 'bg-transparent'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {courseInfo.thumbnail ? (
              <img src={courseInfo.thumbnail} alt="thumbnail" className="max-h-full w-full object-cover" />
            ) : (
              <span className="text-center text-black dark:text-white">Kéo thả hoặc chọn ảnh bìa cho khóa học</span>
            )}
          </label>
        </div>
        <div className="mb-10 flex w-full items-center justify-end">
          <input
            type="submit"
            value="Tiếp theo"
            className="mt-8 h-[40px] w-full cursor-pointer rounded bg-[#37a39a] text-center text-[#fff] 800px:w-[180px]"
          />
        </div>
      </form>
    </div>
  );
};

export default CourseInfomation;
