import React, { FC, useEffect, useState } from 'react';
import { useGetHeroDataQuery } from '../../../../../redux/features/layout/layoutApi';
import { AiOutlineCamera } from 'react-icons/ai';
import Image from 'next/image';
import { styles } from '../../../../utils/style';
interface EditHeroProps {}

const EditHero: FC<EditHeroProps> = (props) => {
    const [image, setImage] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [subtitle, setSubtitle] = useState<string>('');
    const { data } = useGetHeroDataQuery('Banner', {
        refetchOnMountOrArgChange: true
    });
    const handleChangeBanner = (e: any) => {};
    const handleUpdate = () => {};
    console.log(data);
    useEffect(() => {
        if (data) {
            setTitle(data?.layout?.banner?.title);
            setSubtitle(data?.layout?.banner?.subtitle);
            setImage(data?.layout?.banner?.image?.url);
        }
    }, [data]);
    return (
        <>
            <div className="w-full items-center 1000px:flex">
                <div className="hero_animation 1100px:leff-[18rem] absolute top-[10px] h-[50vh] w-[50vh] rounded-[50%] 1000px:top-[unset] 1100px:h-[500px] 1100px:w-[500px] 1500px:left-[21rem] 1500px:h-[700px] 1500px:w-[700px]">
                    <div className="z-10 flex items-center justify-end pt-[70px] 1000px:min-h-screen 1000px:w-[40%] 1000px:pt-[0]">
                        <div className="relative flex items-center justify-end">
                            <img
                                src={image}
                                alt="banner"
                                className="z-[10] h-[auto] w-[90%] object-contain 1100px:max-w-[90%] 1500px:max-w-[85%]"
                            />
                            <input
                                type="file"
                                name=""
                                id="banner"
                                accept="image/*"
                                onChange={handleChangeBanner}
                                className="hidden"
                            />
                            <label htmlFor="banner" className="absolute bottom-0 right-0 z-20">
                                <AiOutlineCamera className="cursor-pointer text-[18px] text-black dark:text-white" />
                            </label>
                        </div>
                    </div>
                    <div className="mt-[150px] flex flex-col items-center text-center 1000px:mt-[0px] 1000px:w-[60%] 1000px:text-left">
                        <textarea
                            name=""
                            id=""
                            className="w-full resize-none bg-transparent px-3 text-[30px] font-[600] text-[#000000c7] dark:text-white 1000px:text-[60px] 1500px:text-[70px]"
                            value={title}
                            placeholder="Nhập tiêu đề..."
                            onChange={(e) => setTitle(e.target.value)}
                            rows={4}
                        />
                        <br />
                        <textarea
                            name=""
                            id=""
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            placeholder="Nhập tiêu đề phụ..."
                            className="absolute top-[100px] bg-transparent font-Josefin text-[18px] font-[600] text-[#000000ac] dark:text-[#edfff4] 1100px:!w-[74%] 1500px:!w-[55%]"
                        />
                    </div>
                </div>
                <div
                    className={`${styles.button} !h-[40px] !min-h-[40px] !w-[100px] bg-[#cccccc34] text-black dark:text-white ${
                        data?.layout?.banner?.title !== title ||
                        data?.layout?.banner?.subtitle !== subtitle ||
                        data?.layout?.banner?.image?.url !== image
                            ? '!cursor-pointer !bg-[#42d383]'
                            : '!cursor-not-allowed'
                    } absolute bottom-12 right-12 !rounded`}
                    onClick={
                        data?.layout?.banner?.title !== title ||
                        data?.layout?.banner?.subtitle !== subtitle ||
                        data?.layout?.banner?.image?.url !== image
                            ? handleUpdate
                            : () => {}
                    }
                >
                    Lưu
                </div>
            </div>
        </>
    );
};

export default EditHero;
