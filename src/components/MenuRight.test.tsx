import { render, screen } from "@testing-library/react";
import { User } from "../model";
import { MenuRight } from "./MenuRight";
import user from "@testing-library/user-event";
import { MenuIntlProvider } from "./i18n/MenuIntlProvider";

const secondaryNav = "secondary nav";

const userData: User = {
  email: "test@makingsense.com",
  fullname: "test makingsense",
  plan: {
    planType: "free",
    description: "Available Contacts",
    itemDescription: "Contacts",
    planName: "Free Trial",
    isSubscribers: true,
    maxSubscribers: 500,
    remainingCredits: 500,
    buttonText: "UPGRADE",
    buttonUrl: "/ControlPanel/AccountPreferences/PreUpgrade?origin=hello_bar",
    pendingFreeUpgrade: true,
    isMonthlyByEmail: false,
  },
  lang: "es",
  avatar: { text: "BS", color: "#EE9C70" },
  navItems: [
    {
      title: "Control Panel",
      url: "/ControlPanel/ControlPanel/",
      idHTML: "controlPanel",
    },
  ],
  sms: { smsEnabled: false },
  isLastPlanRequested: false,
  hasClientManager: false,
};

describe("<MenuRight />", () => {
  it("should not break if props are missing", () => {
    render(
      <MenuIntlProvider>
        <MenuRight
          user={userData}
          notifications={[]}
          emptyNotificationText={""}
          setOpenMenuMobile={jest.fn()}
        />
      </MenuIntlProvider>
    );

    expect(screen.getAllByRole("navigation").length).toEqual(1);
    expect(screen.getByLabelText(secondaryNav)).toBeInTheDocument();
  });

  it.each([
    { lang: "es" as const, expectedUrl: "https://help.fromdoppler.com/es" },
    { lang: "en" as const, expectedUrl: "https://help.fromdoppler.com/en" },
  ])("should render MenuRight properly ($lang)", ({ lang, expectedUrl }) => {
    render(
      <MenuIntlProvider>
        <MenuRight
          user={{ ...userData, lang }}
          notifications={[]}
          emptyNotificationText={""}
          setOpenMenuMobile={jest.fn()}
        />
      </MenuIntlProvider>
    );

    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveAttribute("href");
    });

    const helpIcon = screen.getByText("help");
    const helpLink = helpIcon.parentElement;
    expect(helpLink).toHaveAttribute("href", expectedUrl);
    expect(helpLink).toHaveAttribute("target", "_blank");
  });

  it("should call toggle menu when open/close icon is clicked", async () => {
    const toggleMenu = jest.fn();
    render(
      <MenuIntlProvider>
        <MenuRight
          user={userData}
          notifications={[]}
          emptyNotificationText={""}
          setOpenMenuMobile={toggleMenu}
        />
      </MenuIntlProvider>
    );

    const openMenu = screen.getByTestId("open-menu");
    const closeMenu = screen.getByTestId("close-menu");
    await user.click(openMenu);
    await user.click(closeMenu);
    expect(toggleMenu).toHaveBeenCalledTimes(2);
  });
});
