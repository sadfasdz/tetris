export default class Controller {
  constructor(game, view) {
    this.game = game;
    this.view = view;
    this.intervalId = null;
    this.isPlaing = false;

    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));

    this.view.renderStartScreen();
  }

  update() {
    this.game.movePieceDown();
    this.view.renderMainScreen(this.game.getState());
  }

  handleKeyDown(event) {
    const state = this.game.getState();
    switch (event.keyCode) {
      case 13:
        if (state.isGameOver) {
          this.reset();
        } else if (this.isPlaing) {
          this.pause();
        } else {
          this.play();
        }
        break;
      case 37:
        if (this.isPlaing) {
          this.game.movePieceLeft();
          this.updateView();
        }
        break;
      case 32:
        if (this.isPlaing) {
          this.game.rotatePiece();
          this.updateView();
        }
        break;
      case 39:
        if (this.isPlaing) {
          this.game.movePieceRight();

          this.updateView();
        }
        break;
      case 40:
        if (this.isPlaing) {
          this.stopTimer();
          this.game.movePieceDown();
          this.updateView();
        }
        break;
    }
  }

  handleKeyUp() {
    switch (event.keyCode) {
      case 40:
        this.startTimer();
        break;
    }
  }

  play() {
    this.isPlaing = true;
    this.startTimer();
    this.updateView();
  }

  pause() {
    this.isPlaing = false;
    this.stopTimer();
    this.updateView();
  }

  reset() {
    this.game.reset();
    this.play();
  }

  startTimer() {
    const speed = 700 - this.game.getState().level * 100;

    if (!this.intervalId) {
      this.intervalId = setInterval(
        () => {
          if (this.isPlaing) {
            this.update();
          }
        },
        speed > 0 ? speed : 100
      );
    }
  }

  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  updateView() {
    const state = this.game.getState();

    if (state.isGameOver) {
      this.view.renderGameOverScreen(state);
      this.isPlaing = false;
    } else if (!this.isPlaing) {
      this.view.renderPauseScreen();
    } else {
      this.view.renderMainScreen(state);
    }
  }
}
