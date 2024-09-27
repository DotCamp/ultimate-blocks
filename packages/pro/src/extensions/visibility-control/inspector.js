import { isEmpty } from "lodash";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { useState, useEffect } from "@wordpress/element";
import { InspectorControls } from "@wordpress/block-editor";
import {
  ToggleControl,
  PanelBody,
  SelectControl,
  Spinner,
  FormTokenField,
  TextControl,
} from "@wordpress/components";
import CustomDatePicker from "./components/custom-date-picker";

const panelIcon = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.2791 10.3849L11.9471 10.3524C10.9893 10.3524 10.2129 11.1494 10.2129 12.132C10.2129 13.1154 10.9893 13.9125 11.9471 13.9125C12.9049 13.9125 13.6813 13.1154 13.6813 12.132C13.6813 12.0919 13.6797 12.0526 13.6772 12.0134C13.5234 12.1053 13.346 12.1571 13.1572 12.1571C12.568 12.1571 12.0911 11.6508 12.0911 11.0258C12.0911 10.7877 12.1611 10.5671 12.2791 10.3849Z"
      fill="#E11B4C"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M16.9455 11.8981C16.3856 10.8545 15.6475 9.99558 14.7905 9.4032C13.9539 8.82585 13.0059 8.5 12 8.5C10.9941 8.5 10.0452 8.82585 9.20947 9.4032C8.35254 9.99558 7.61442 10.8545 7.05452 11.8981L7 12L7.05452 12.1011C7.61442 13.1447 8.35254 14.0036 9.21029 14.5968C10.0452 15.1741 10.9941 15.5 12 15.5C13.0059 15.5 13.9548 15.1741 14.7905 14.596C15.6466 14.0036 16.3856 13.1447 16.9455 12.1011L17 12L16.9455 11.8981ZM14.1785 10.0691C14.8442 10.5295 15.4229 11.1929 15.8704 12C15.4229 12.8071 14.8442 13.4705 14.1785 13.9301C13.5226 14.3829 12.7829 14.6386 12 14.6386C11.2179 14.6386 10.4774 14.3829 9.82227 13.9301C9.15658 13.4705 8.57715 12.8071 8.12956 12C8.57796 11.1929 9.15658 10.5295 9.82227 10.0691C10.4774 9.61626 11.2179 9.36059 12 9.36059C12.7829 9.36059 13.5234 9.61626 14.1785 10.0691Z"
      fill="#E11B4C"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M15.7647 20.1262C14.8304 20.6599 13.8963 21.1935 12.9618 21.7264C12.332 22.0856 11.6892 22.0934 11.0604 21.7362C9.48667 20.8416 7.91557 19.9431 6.3442 19.0444L6.34153 19.0429C5.54674 18.5883 4.75187 18.1338 3.95655 17.6796C3.32373 17.3184 3.00534 16.7727 3.00336 16.0562C2.9984 13.3561 2.99939 10.656 3.00336 7.95585C3.00435 7.22855 3.32869 6.67989 3.96945 6.31477C4.86931 5.8013 5.76873 5.28725 6.66811 4.77323C8.12899 3.9383 9.59018 3.1032 11.0524 2.27097C11.6644 1.92254 12.3002 1.90389 12.9122 2.25134C15.3255 3.61858 17.7347 4.99268 20.1361 6.37857C20.7223 6.71719 20.996 7.26291 20.998 7.93524C20.9993 8.84022 20.9989 9.74564 20.9984 10.6509L20.998 12.0085C20.998 12.3419 20.9988 12.6752 20.9986 13.0085L20.9985 13.21C20.9978 14.144 20.9972 15.0778 21 16.012C21.002 16.7717 20.6707 17.3282 20.0051 17.7071C18.5909 18.5117 17.1773 19.3192 15.7647 20.1262ZM12.4664 20.8577C12.1349 21.0468 11.8683 21.045 11.5544 20.8667C9.98152 19.9726 8.41227 19.0751 6.84143 18.1768L6.83745 18.1745C6.04307 17.7202 5.24828 17.2657 4.45242 16.8112C4.12697 16.6255 4.00443 16.4078 4.00336 16.0539C3.9984 13.3553 3.99939 10.6566 4.00336 7.95732C4.00385 7.59712 4.12824 7.37524 4.46454 7.18361C5.36569 6.6694 6.2661 6.15479 7.1656 5.6407L7.16734 5.63971C8.62706 4.80544 10.0858 3.97176 11.5471 3.14007C11.8726 2.95474 12.1325 2.95857 12.4185 3.12096C14.83 4.48722 17.2375 5.86034 19.6359 7.24448C19.8752 7.38273 19.9969 7.57517 19.998 7.93819C19.9993 8.84143 19.9989 9.7443 19.9984 10.6482L19.9984 10.6598C19.9982 11.109 19.998 11.5586 19.998 12.0085V13.0085L19.9985 13.2072C19.9978 14.1418 19.9972 15.0787 20 16.0147C20.0006 16.244 19.9524 16.3911 19.8912 16.4949C19.8294 16.5999 19.72 16.7187 19.5106 16.8379C18.0964 17.6425 16.6822 18.4504 15.2691 19.2576L15.2674 19.2586C14.3332 19.7922 13.3994 20.3257 12.4664 20.8577Z"
      fill="#E11B4C"
    />
  </svg>
);
function Inspector(props) {
  const [roles, setRoles] = useState([]);
  const [usersOptions, setUsersOptions] = useState([]);
  const { attributes, setAttributes } = props;
  const {
    isBlockHide,
    hideBlockFromRole,
    hideWhenTimeScheduleApplied,
    hideBlockFromTime,
    hideBlockToTime,
    hideBlockUserRole,
    isScheduleEnable,
  } = attributes;

  const { users } = useSelect((select) => {
    const { getUsers } = select("core");

    return {
      users: getUsers(),
    };
  });
  useEffect(() => {
    const availableRoles = !isEmpty(ub_roles) ? ub_roles : null;
    if (availableRoles) {
      const rolesArray = [];
      for (const [role, { name, capabilities }] of Object.entries(
        availableRoles
      )) {
        rolesArray.push(name);
      }

      setRoles(rolesArray);
    }
  }, []);
  useEffect(() => {
    const isUsersAvailable = !isEmpty(users);
    if (isUsersAvailable) {
      const updatedOptions = users.map((user) => {
        return user.name;
      });
      setUsersOptions(updatedOptions);
    }
  }, [users]);

  const userRolesOptions = [
    {
      label: __("Public", "ultimate-blocks-pro"),
      value: "public",
      help: __("Block is visible to everyone.", "ultimate-blocks-pro"),
    },
    {
      label: __("User", "ultimate-blocks-pro"),
      value: "user",
      help: __("Show the block to the selected users.", "ultimate-blocks-pro"),
    },
    {
      label: __("User Role", "ultimate-blocks-pro"),
      value: "user-role",
      help: __(
        "Show the block to users with at least one of the selected roles.",
        "ultimate-blocks-pro"
      ),
    },
    {
      label: __("Logged In", "ultimate-blocks-pro"),
      value: "logged-in",
      help: __(
        "Block is only visible to logged-in users.",
        "ultimate-blocks-pro"
      ),
    },
    {
      label: __("Logged Out", "ultimate-blocks-pro"),
      value: "logged-out",
      help: __(
        "Block is only visible to logged-out users.",
        "ultimate-blocks-pro"
      ),
    },
  ];
  const help = userRolesOptions.find(
    (option) => option.value === hideBlockFromRole
  )?.help;

  const isLoading = users === null;

  return (
    <InspectorControls>
      <PanelBody
        title={__("Visibility Control")}
        initialOpen={false}
        icon={panelIcon}
      >
        <ToggleControl
          checked={isBlockHide}
          label={__("Hide the block from everyone", "ultimate-blocks-pro")}
          onChange={() => setAttributes({ isBlockHide: !isBlockHide })}
          help={__(
            "The Hide Block control overrides all other visibility controls when enabled.",
            "ultimate-blocks-pro"
          )}
        />
        <ToggleControl
          checked={isScheduleEnable}
          label={__("Enable Schedule", "ultimate-blocks-pro")}
          onChange={() =>
            setAttributes({
              isScheduleEnable: !isScheduleEnable,
            })
          }
        />
        {isScheduleEnable && (
          <>
            <CustomDatePicker
              attrKey="hideBlockFromTime"
              label={__("From", "ultimate-blocks-pro")}
            />
            <CustomDatePicker
              attrKey="hideBlockToTime"
              label={__("To", "ultimate-blocks-pro")}
            />
            <ToggleControl
              checked={hideWhenTimeScheduleApplied}
              label={__("Hide when schedules apply", "ultimate-blocks-pro")}
              onChange={() =>
                setAttributes({
                  hideWhenTimeScheduleApplied: !hideWhenTimeScheduleApplied,
                })
              }
            />
          </>
        )}
        {isLoading && <Spinner />}
        {!isLoading && (
          <>
            <SelectControl
              help={help}
              __nextHasNoMarginBottom
              value={hideBlockFromRole}
              size={"__unstable-large"}
              options={userRolesOptions}
              label={__("User Role", "ultimate-blocks-pro")}
              onChange={(hideBlockFromRole) => {
                setAttributes({ hideBlockFromRole: hideBlockFromRole });
              }}
            />
            {hideBlockFromRole === "user" && (
              <FormTokenField
                __next40pxDefaultSize
                __experimentalExpandOnFocus
                value={hideBlockUserRole}
                label=""
                suggestions={usersOptions}
                onChange={(hideBlockUserRole) =>
                  setAttributes({ hideBlockUserRole: hideBlockUserRole })
                }
              />
            )}
            {hideBlockFromRole === "user-role" && (
              <FormTokenField
                __next40pxDefaultSize
                __experimentalExpandOnFocus
                value={hideBlockUserRole}
                label=""
                suggestions={roles}
                onChange={(hideBlockUserRole) =>
                  setAttributes({ hideBlockUserRole: hideBlockUserRole })
                }
              />
            )}
          </>
        )}
      </PanelBody>
    </InspectorControls>
  );
}
export default Inspector;
