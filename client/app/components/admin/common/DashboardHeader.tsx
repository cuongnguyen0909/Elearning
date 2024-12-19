import React, { FC, useEffect, useState } from 'react';
import ThemeSwitcher from '../../../../components/theme/ThemeSwitcher';
import { IoMdNotificationsOutline } from 'react-icons/io';
import socketIO from 'socket.io-client';
import {
  useGetNotificationsQuery,
  useUpdateNotificationStatusMutation
} from '../../../../redux/features/notification/notificationApi';
import { formatRelativeTime } from '../../../utils/formatHelper';
const ENPOINT = process.env.NEXT_PUBLIC_SOCKET_API_SERVER_URL || '';
const socketId = socketIO(ENPOINT, {
  transports: ['websocket']
});
interface DashboardHeaderProps {
  open?: boolean;
  setOpen?: any;
}

const DashboardHeader: FC<DashboardHeaderProps> = (props) => {
  const { open, setOpen } = props;

  const {
    data: allNotifications,
    error: errorNotifications,
    isLoading: isLoadingNotifications,
    isSuccess: isSuccessNotifications,
    refetch
  } = useGetNotificationsQuery(
    {},
    {
      refetchOnMountOrArgChange: true
    }
  );

  const [
    updateNotificationStatus,
    {
      data: dataUpdateNotificationStatus,
      error: errorUpdateNotificationStatus,
      isLoading: isLoadingUpdateNotificationStatus,
      isSuccess: isSuccessUpdateNotificationStatus
    }
  ] = useUpdateNotificationStatusMutation();

  const [notifications, setNotifications] = useState<any>([null]);

  const [audio] = useState(
    new Audio('https://res.cloudinary.com/dupkxi4xl/video/upload/v1734614076/audio/notification_jyprpy.mp3')
  );
  const playerNotificationAudio = () => {
    audio.play();
  };

  useEffect(() => {
    if (allNotifications) {
      setNotifications(
        allNotifications?.notifications?.filter((notification: any) => notification?.status === 'unread')
      );
    }
    if (isSuccessNotifications) {
      refetch();
    }
    audio.load();
  }, [allNotifications, isSuccessNotifications]);

  useEffect(() => {
    socketId.on('newNotification', (data) => {
      refetch();
      playerNotificationAudio();
    });
  }, [allNotifications]);

  const handleUpdateNotificationStatus = async (id: string) => {
    await updateNotificationStatus({ id });
  };

  useEffect(() => {
    if (isSuccessUpdateNotificationStatus) {
      refetch();
    }
  }, [isSuccessUpdateNotificationStatus]);
  return (
    <div className="fixed right-0 top-5 z-20 flex w-full items-center justify-end p-6">
      {/* <ThemeSwitcher /> */}
      <div className="relative m-2 cursor-pointer" onClick={() => setOpen(!open)}>
        <IoMdNotificationsOutline className="cursor-pointer text-2xl text-black dark:text-white" />
        <span className="absolute -right-2 -top-2 flex w-[20px] items-center justify-center rounded-full bg-[#3ccba0] text-[12px] text-white">
          {notifications && notifications?.length}
        </span>
      </div>
      {open && (
        <div className="absolute top-16 z-10 h-[50vh] w-[350px] rounded bg-white shadow-xl dark:bg-[#111C43]">
          <h5 className="text-center font-Arimo text-[20px] text-black dark:text-white">Notifications</h5>
          {/* <div className="border-b border-b-[#000000f] bg-[#00000013] font-Arimo dark:border-[#ffffff47] dark:bg-[#2d3a4ea1]">
            <div className="flex w-full items-center justify-between p-2">
              <p className="text-black dark:text-white">New Question Received</p>
              <p className="cursor-pointer text-black dark:text-white">Mark as read</p>
            </div>
            <p className="px-2 text-black dark:text-white">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae fugiat officiis ipsam aliquam, quis
              mollitia optio dolor libero voluptatum nulla.
            </p>
            <p className="p-2 text-[14px] text-black dark:text-white">5 days ago</p>
          </div>
          <div className="border-b border-b-[#000000f] bg-[#00000013] font-Arimo dark:border-[#ffffff47] dark:bg-[#2d3a4ea1]">
            <div className="flex w-full items-center justify-between p-2">
              <p className="text-black dark:text-white">New Question Received</p>
              <p className="cursor-pointer text-black dark:text-white">Mark as read</p>
            </div>
            <p className="px-2 text-black dark:text-white">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae fugiat officiis ipsam aliquam, quis
              mollitia optio dolor libero voluptatum nulla.
            </p>
            <p className="p-2 text-[14px] text-black dark:text-white">5 days ago</p>
          </div> */}
          {notifications &&
            notifications?.map((notification: any) => (
              <div className="border-b border-b-[#000000f] bg-[#00000013] font-Arimo dark:border-[#ffffff47] dark:bg-[#2d3a4ea1]">
                <div className="flex w-full items-center justify-between p-2">
                  <p className="text-black dark:text-white">{notification?.title || 'New Question Received'}</p>
                  <p
                    className="cursor-pointer text-black dark:text-white"
                    onClick={() => handleUpdateNotificationStatus(notification?._id)}
                  >
                    Đánh dấu đã đọc
                  </p>
                </div>
                <p className="px-2 text-black dark:text-white">{notification?.message}</p>
                <p className="p-2 text-[14px] text-black dark:text-white">
                  {formatRelativeTime(notification?.createdAt)}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
