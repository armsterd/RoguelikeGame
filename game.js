import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
    constructor(name, hp = 100) {
        this.hp = hp;
        this.name = name;
    }

    attack(target) {
        // 플레이어의 공격
        console.log(this.name + '이 ' + target.name + ' 을 공격합니다.');
        target.attacked(target);
    }

    attacked(damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            console.log(this.name + '이' + '죽었습니다.');
            continueBattle = false;
        } else {
            console.log(this.name + ' 님의 체력이 ' + this.hp + ' 남았습니다.');
        }
    }

    run(percent) {
        if (percent < 0.5) {
            console.log(this.name + '은 도망치는데 실패했습니다.');
        } else {
            console.log(this.name + '은 도망쳤습니다.')
        }
    }
}

class Monster {
    constructor(name, hp = 100) {
        this.hp = hp;
        this.name = name;
    }

    attack(target) {
        // 몬스터의 공격
        console.log(this.name + '이 ' + target.name + ' 을 공격합니다.');
        target.attacked(target);
    }

    attacked(damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            console.log(this.name + '이' + '죽었습니다.');
            continueBattle = false;
        } else {
            console.log(this.name + ' 님의 체력이 ' + this.hp + ' 남았습니다.');
        }
    }

    run(percent) {
        if (percent < 0.5) {
            console.log(this.name + '은 도망치는데 실패했습니다.');
        } else {
            console.log(this.name + '은 도망쳤습니다.')
        }
    }

}

function displayStatus(stage, player, monster) {
    console.log(chalk.magentaBright(`\n=== Current Status ===`));
    console.log(
        chalk.cyanBright(`| Stage: ${stage} `) +
        chalk.blueBright(
            `| 플레이어 정보`,
        ) +
        chalk.redBright(
            `| 몬스터 정보 |`,
        ),
    );
    console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
    let logs = [];

    while (player.hp > 0) {
        console.clear();
        displayStatus(stage, player, monster);

        logs.forEach((log) => console.log(log));

        console.log(
            chalk.green(
                `\n1. 공격한다 2. 아무것도 하지않는다.`,
            ),
        );
        const choice = readlineSync.question('당신의 선택은? ');

        // 플레이어의 선택에 따라 다음 행동 처리
        logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
        switch (choice) {
            case '1':
                player.attack(monster);
                break;
            case '2':
                player.run(Math.random());
                break;
        }
    }

};

export async function startGame() {
    console.clear();
    const player = new Player();
    let stage = 1;

    while (stage <= 10) {
        const monster = new Monster(stage);
        await battle(stage, player, monster);
        const continueBattle = true;
        // 스테이지 클리어 및 게임 종료 조건
        while (continueBattle) {
            if (monster.hp > 0) {
                monster.attack(player);
            }
        }
        stage++;
    }
}