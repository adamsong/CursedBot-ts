import {Command} from "../Command";
import {Hello} from "./Hello";
import {ScheduleCommand} from "./ScheduleCommand";
import { TranslateCommand } from './TranslateCommand';
import { CampaignCommand } from './CampaignCommand';
import { CardCommand } from './CardCommand';

export const Commands: Command[] = [
    Hello,
    ScheduleCommand,
    TranslateCommand,
    CampaignCommand,
    CardCommand
];
