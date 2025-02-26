import { useMemo, useState } from "react";
import useOnclickOutside from "react-cool-onclickoutside";

interface NotificationsProps {
  notifications: ReadonlyArray<string>;
  emptyNotificationText: string;
}

export const Notifications = ({
  notifications,
  emptyNotificationText,
}: NotificationsProps) => {
  const count = notifications.length;
  const [openNotification, setOpenNotification] = useState(false);
  const notificationsRef = useOnclickOutside(() => setOpenNotification(false));

  const NotificationWrapper = useMemo(() => {
    const handleToggleNotification = () =>
      setOpenNotification(!openNotification);

    return ({ children }: any) => (
      <li ref={notificationsRef}>
        <span
          className="user-menu--open active"
          data-count={count ? count : null}
          onClick={handleToggleNotification}
        >
          <span className="ms-icon icon-notification" />
        </span>
        {children}
      </li>
    );
  }, [count, notificationsRef, openNotification, setOpenNotification]);

  if (count < 1) {
    return <NotificationWrapper>{emptyNotificationText}</NotificationWrapper>;
  }

  return (
    <NotificationWrapper>
      <div
        className={`user-menu helper--right dp-notifications ${
          openNotification ? "open" : ""
        }`}
      >
        {notifications.map((notification, index) => {
          return (
            <div key={index} className="dp-msj-notif">
              <div dangerouslySetInnerHTML={{ __html: notification }} />
            </div>
          );
        })}
      </div>
    </NotificationWrapper>
  );
};
