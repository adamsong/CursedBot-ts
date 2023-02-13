import {Command} from "../Command";
import {Hello} from "./Hello";
import {ScheduleCommand} from "./ScheduleCommand";
import { TranslateCommand } from './TranslateCommand';

export const Commands: Command[] = [
    Hello,
    ScheduleCommand,
    TranslateCommand
];
