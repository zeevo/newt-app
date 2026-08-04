import type { Module } from "../types";
import componentsJson from "./templates/components-json";
import webComponentsJson from "./templates/web-components-json";
import packageJson from "./templates/package-json";
import utils from "./templates/utils";
import useMobile from "./templates/use-mobile";
import globalsCss from "./templates/globals-css";
import postcssConfig from "./templates/postcss-config";
import tsconfig from "./templates/tsconfig";
import link from "./templates/link";
import logo from "./templates/logo";
import layout from "./templates/layout";
import page from "./templates/page";
import providers from "./templates/providers";
import authForm from "./templates/auth-form";
import accordion from "./templates/accordion";
import alertDialog from "./templates/alert-dialog";
import alert from "./templates/alert";
import aspectRatio from "./templates/aspect-ratio";
import avatar from "./templates/avatar";
import badge from "./templates/badge";
import breadcrumb from "./templates/breadcrumb";
import button from "./templates/button";
import calendar from "./templates/calendar";
import card from "./templates/card";
import carousel from "./templates/carousel";
import chart from "./templates/chart";
import checkbox from "./templates/checkbox";
import collapsible from "./templates/collapsible";
import command from "./templates/command";
import combobox from "./templates/combobox";
import contextMenu from "./templates/context-menu";
import dialog from "./templates/dialog";
import direction from "./templates/direction";
import drawer from "./templates/drawer";
import dropdownMenu from "./templates/dropdown-menu";
import empty from "./templates/empty";
import field from "./templates/field";
import hoverCard from "./templates/hover-card";
import buttonGroup from "./templates/button-group";
import inputGroup from "./templates/input-group";
import item from "./templates/item";
import kbd from "./templates/kbd";
import nativeSelect from "./templates/native-select";
import spinner from "./templates/spinner";
import inputOtp from "./templates/input-otp";
import input from "./templates/input";
import label from "./templates/label";
import menubar from "./templates/menubar";
import navigationMenu from "./templates/navigation-menu";
import pagination from "./templates/pagination";
import popover from "./templates/popover";
import progress from "./templates/progress";
import radioGroup from "./templates/radio-group";
import resizable from "./templates/resizable";
import scrollArea from "./templates/scroll-area";
import select from "./templates/select";
import separator from "./templates/separator";
import sheet from "./templates/sheet";
import sidebar from "./templates/sidebar";
import skeleton from "./templates/skeleton";
import slider from "./templates/slider";
import sonner from "./templates/sonner";
import switchComp from "./templates/switch";
import table from "./templates/table";
import tabs from "./templates/tabs";
import textarea from "./templates/textarea";
import toggleGroup from "./templates/toggle-group";
import toggle from "./templates/toggle";
import tooltip from "./templates/tooltip";
import modeToggle from "./templates/mode-toggle";
import attachment from "./templates/attachment";
import bubble from "./templates/bubble";
import marker from "./templates/marker";
import message from "./templates/message";
import messageScroller from "./templates/message-scroller";

const shadcnUi: Module = {
  templates: [
    packageJson,
    utils,
    useMobile,
    globalsCss,
    postcssConfig,
    tsconfig,
    link,
    logo,
    layout,
    page,
    providers,
    authForm,
    accordion,
    alertDialog,
    alert,
    aspectRatio,
    avatar,
    badge,
    breadcrumb,
    button,
    calendar,
    card,
    carousel,
    chart,
    checkbox,
    collapsible,
    command,
    combobox,
    contextMenu,
    dialog,
    direction,
    drawer,
    dropdownMenu,
    empty,
    field,
    hoverCard,
    buttonGroup,
    inputGroup,
    item,
    kbd,
    nativeSelect,
    spinner,
    inputOtp,
    input,
    label,
    menubar,
    navigationMenu,
    pagination,
    popover,
    progress,
    radioGroup,
    resizable,
    scrollArea,
    select,
    separator,
    sheet,
    sidebar,
    skeleton,
    slider,
    sonner,
    switchComp,
    table,
    tabs,
    textarea,
    toggleGroup,
    toggle,
    tooltip,
    modeToggle,
    attachment,
    bubble,
    marker,
    message,
    messageScroller,
    componentsJson,
    webComponentsJson,
  ],
  packages: [
    { package: "next-themes", module: "apps/web", version: "^0.4.6" },
    { package: "sonner", module: "apps/web", version: "^2.0.7" },
  ],
};

export default shadcnUi;
