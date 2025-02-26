import { useState } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { PlanType, User } from "../model";
import { Modal } from "./Modal";
import { Tooltip } from "./Tooltip";
import { UpgradePlanForm } from "./UpgradePlanForm";

interface UserPlanProps {
  user: User;
}

export const UserPlan = ({ user }: UserPlanProps) => {
  const { sms, plan, isLastPlanRequested } = user;

  const {
    planName,
    maxSubscribers,
    planType,
    itemDescription,
    buttonUrl,
    pendingFreeUpgrade,
    remainingCredits,
    description,
    isSubscribers,
    isMonthlyByEmail,
  } = plan;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModalHandler = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="user-plan--type">
        {isSubscribers || isMonthlyByEmail ? (
          <UpgradePlanItem
            showPlanLink={!!buttonUrl && !pendingFreeUpgrade}
            buttonUrl={plan.buttonUrl}
            buttonText={plan.buttonText}
          >
            <strong>{planName}</strong> ({maxSubscribers} {itemDescription})
          </UpgradePlanItem>
        ) : (
          <UpgradePlanItem
            showPlanLink={!!buttonUrl && !pendingFreeUpgrade}
            buttonUrl={plan.buttonUrl}
            buttonText={plan.buttonText}
          />
        )}
        {!buttonUrl || pendingFreeUpgrade ? (
          <UpdatePlanButton
            showTips={isLastPlanRequested}
            click={openModalHandler}
            text={plan.buttonText}
          />
        ) : null}
      </div>
      <div className="user-plan--type">
        <CurrentPlanCredits
          planType={planType}
          remainingCredits={remainingCredits}
          credits={maxSubscribers}
          description={description}
        />
        {sms.smsEnabled ? (
          <RechargeSMSPlanCredits
            buttonText={sms.buttonText}
            buttonUrl={sms.buttonUrl}
            description={sms.description}
            remainingCredits={sms.remainingCredits}
          />
        ) : null}
      </div>

      <Modal
        isOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        data-testid={"upgrade.plan.form.modal"}
      >
        <UpgradePlanForm
          isSubscriber={isSubscribers}
          handleClose={() => setIsModalOpen(false)}
          user={user}
        />
      </Modal>
    </>
  );
};

const CurrentPlanCredits = ({
  planType,
  credits,
  remainingCredits,
  description,
}: {
  credits: number;
  remainingCredits: number;
  planType?: PlanType;
  description?: string;
}) => {
  if (planType === "monthly-deliveries" || planType === "contacts") {
    const creditCriteria =
      planType === "contacts"
        ? "header.plan_subscribers"
        : "header.plan_emails";
    return (
      <div className="user-plan--buyContainer">
        <p>
          {credits - remainingCredits} <FormattedMessage id={creditCriteria} />{" "}
          (<strong>{remainingCredits}</strong>{" "}
          <FormattedMessage id="header.availables" />)
        </p>
      </div>
    );
  }
  return (
    <div className="user-plan--buyContainer">
      <p>
        <strong>{remainingCredits}</strong> {description}
      </p>
    </div>
  );
};

const RechargeSMSPlanCredits = ({
  remainingCredits,
  description,
  buttonUrl,
  buttonText,
}: {
  remainingCredits: number;
  description: string;
  buttonUrl: string;
  buttonText: string;
}) => {
  return (
    <div
      className="user-plan--buyContainer"
      data-testid="sms-information-test-id"
    >
      <p>
        <strong>
          US${" "}
          <FormattedNumber
            // eslint-disable-next-line react/style-prop-object
            style="decimal"
            value={remainingCredits}
            minimumFractionDigits={2}
            maximumFractionDigits={2}
          />
        </strong>{" "}
        {description}
      </p>
      <a className="user-plan" target="_self" href={buttonUrl}>
        {buttonText}
      </a>
    </div>
  );
};

type UpdatePlanButtonProp =
  | {
      showTips: false;
      text: string;
      click: () => void;
    }
  | {
      showTips: true;
      click: () => void;
    };

const UpdatePlanButton = (props: UpdatePlanButtonProp) => {
  if (props.showTips) {
    return (
      <div className="dp-request-sent">
        <Tooltip>
          <button
            onClick={props.click}
            className="user-plan close-user--menu dp-tooltip-left"
          >
            <FormattedMessage id="header.send_request" />
            <div className="tooltiptext">
              <FormattedMessage id="header.tooltip_last_plan" />
            </div>
          </button>
          <span className="ms-icon icon-info-icon" />
        </Tooltip>
      </div>
    );
  }
  return (
    <button onClick={props.click} className="user-plan">
      {props.text}
    </button>
  );
};

const UpgradePlanItem = ({
  showPlanLink,
  buttonText,
  buttonUrl,
  children,
}: {
  showPlanLink: boolean;
  buttonUrl: string;
  buttonText: string;
  children?: any;
}) => {
  return (
    <>
      <p className="user-plan--monthly-text">
        {children ? children : <FormattedMessage id="header.plan_prepaid" />}
      </p>
      {showPlanLink ? (
        <a className="user-plan" href={buttonUrl}>
          {buttonText}
        </a>
      ) : null}
    </>
  );
};
