import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
    constructor(name = 'Hero', hp = 100) {
        this.hp = hp;
        this.name = name;
    }

    attack(target) {
        // 플레이어의 공격
        const damage = Math.floor(Math.random() * 70 + 10);
        console.log(chalk.yellowBright(`${this.name}이 ${target.name}을 공격합니다.`));
        console.log(chalk.yellow(`${this.name}이 ${target.name}에게 ${damage}만큼의 피해를 줍니다.`));
        target.underAttack(this, damage);
    }

    underAttack(target, damage) {
        const percent = Math.random();
        if (percent < 0.2) {
            this.parry(target);
        } else {
            this.hp -= damage;
            console.log(chalk.blueBright(`${this.name}님의 체력이 ${this.hp}만큼 남았습니다.`));
        }
    }

    parry(target) {
        console.log(chalk.blueBright(`${this.name}이 패링에 성공했습니다.`));
        this.attack(target);
    }

    run(percent) {
        if (percent < 0.5) {
            console.log(this.name + '은 도망치는데 실패했습니다.');
            return false;
        } else {
            console.log(this.name + '은 도망쳤습니다.')
            return true;
        }
    }
}

class Monster {
    constructor(stage, name = 'Thaemine', hp = 100) {
        this.hp = hp + stage * Math.floor(Math.random() * 80 + 40);
        this.name = name;
        this.stage = stage;
    }

    attack(target) {
        // 몬스터의 공격
        const damage = Math.floor(Math.random() * 20 + 10);
        console.log(chalk.redBright(`${this.name}이 ${target.name}을 공격합니다.`));
        console.log(chalk.red(`${this.name}이 ${target.name}에게 ${damage}만큼의 피해를 줍니다.`));
        target.underAttack(this, damage);
    }

    underAttack(target, damage) {
        const percent = Math.random();
        if (percent < 0.09) {
            this.parry(target);
        } else {
            this.hp -= damage;
            console.log(chalk.redBright(`${this.name}님의 체력이 ${this.hp}만큼 남았습니다.`));
        }
    }

    parry(target) {
        console.log(chalk.red(`${this.name}이 패링에 성공했습니다.`));
        this.attack(target);
    }

    firstAttack(percent, target) {
        if (percent < 0.3) {
            this.attack(target);
            console.log(this.name + '이 선공을 합니다. 강제 전투에 돌입합니다.');
        }

    }
}

function displayStatus(stage, player, monster) {
    console.log(chalk.magentaBright(`\n=== Current Status ===`));
    console.log(
        chalk.cyanBright(`| Stage: ${stage} `) +
        chalk.blueBright(
            `| 플레이어 정보 | 이름: ${player.name} | HP: ${player.hp}`,
        ) +
        chalk.redBright(
            `| 몬스터 정보 | 이름: ${monster.name} | HP: ${monster.hp}`,
        ),
    );
    console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
    let logs = [];
    let battlePhase = true;

    while (player.hp > 0) {
        displayStatus(stage, player, monster);
        console.log(
            chalk.green(
                `\n1. 공격한다 2. 도망간다  3. 아무것도 하지않는다.`,
            ),
        );
        const choice = readlineSync.question('당신의 선택은? ');

        // 플레이어의 선택에 따라 다음 행동 처리
        logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
        logs.forEach((log) => console.log(log));
        switch (choice) {
            case '1':
                logs.shift();
                await player.attack(monster);
                if (monster.hp <= 0) {
                    console.log(chalk.bgBlackBright(`${monster.name}이 죽었습니다.`));
                    player.hp += stage * Math.floor(Math.random() * 120 + 10);
                    battlePhase = false;
                    return battlePhase;
                }
                await monster.attack(player);
                if (player.hp <= 0) {
                    console.log(chalk.red(`${player.name}이 죽었습니다.`));
                    battlePhase = false;
                    return battlePhase;
                }
                break;
            case '2':
                const successRun = await player.run(Math.random());
                logs.shift();
                if (successRun) {
                    stage++;
                    monster.hp += stage * Math.floor(Math.random() * 80 + 10);
                } else {
                    monster.firstAttack(Math.random(), player);
                }
                break;
            case '3':
                logs.shift();
                await monster.firstAttack(Math.random(), player);
                break;
        }
    }

};

export async function startGame() {
    console.clear();
    const player = new Player();
    let stage = 1;
    const battlePhase = true;
    while (stage <= 10) {
        const monster = new Monster(stage);
        await battle(stage, player, monster);
        // 스테이지 클리어 및 게임 종료 조건
        if (battlePhase) {
            if (player.hp <= 0 && monster.hp > 0) {
                console.log(`${player.name}의 체력이 0이하가 되어 죽었습니다. 게임 종료`);
                break;
            } else if (player.hp > 0 && monster.hp <= 0) {
                console.log(`${monster.name}의 체력이 0이하가 되어 죽었습니다. 다음 스테이지로!`);
            }
        }
        stage++;
    }
}