import utils from './utils';

class Setting {
  constructor(player) {
    this.player = player;

    this.player.template.mask.addEventListener('click', () => {
      this.hide();
    });
    this.player.template.settingButton.addEventListener('click', () => {
      this.show();
    });

    // loop
    this.loop = this.player.options.loop;
    this.player.template.loopToggle.checked = this.loop;
    this.player.template.loop.addEventListener('click', () => {
      this.player.template.loopToggle.checked = !this.player.template.loopToggle.checked;
      if (this.player.template.loopToggle.checked) {
        this.loop = true;
      } else {
        this.loop = false;
      }
    });

    // show danmaku
    this.showDanmaku = this.player.user.get('danmaku');
    if (!this.showDanmaku) {
      this.player.danmaku && this.player.danmaku.hide();
    }
    this.player.template.showDanmakuToggle.checked = this.showDanmaku;
    this.player.template.showDanmaku.addEventListener('click', () => {
      this.player.template.showDanmakuToggle.checked = !this.player.template.showDanmakuToggle.checked;
      if (this.player.template.showDanmakuToggle.checked) {
        this.showDanmaku = true;
        this.player.danmaku.show();
      } else {
        this.showDanmaku = false;
        this.player.danmaku.hide();
      }
      this.player.user.set('danmaku', this.showDanmaku ? 1 : 0);
    });

    // unlimit danmaku
    this.unlimitDanmaku = this.player.user.get('unlimited');
    this.player.template.unlimitDanmakuToggle.checked = this.unlimitDanmaku;
    this.player.template.unlimitDanmaku.addEventListener('click', () => {
      this.player.template.unlimitDanmakuToggle.checked = !this.player.template.unlimitDanmakuToggle.checked;
      if (this.player.template.unlimitDanmakuToggle.checked) {
        this.unlimitDanmaku = true;
        this.player.danmaku.unlimit(true);
      } else {
        this.unlimitDanmaku = false;
        this.player.danmaku.unlimit(false);
      }
      this.player.user.set('unlimited', this.unlimitDanmaku ? 1 : 0);
    });

    // danmaku opacity
    if (this.player.danmaku) {
      const dWidth = 204;
      this.player.on('danmaku_opacity', (percentage) => {
        this.player.bar.set('danmaku', percentage, 'width');
        this.player.user.set('opacity', percentage);
      });
      this.player.danmaku.opacity(this.player.user.get('opacity'));

      const danmakuMove = (event) => {
        const e = event || window.event;
        let percentage = ((e.clientX || e.changedTouches[0].clientX) - utils.getBoundingClientRectViewLeft(this.player.template.danmakuOpacityBarWrap)) / dWidth;
        percentage = Math.max(percentage, 0);
        percentage = Math.min(percentage, 1);
        this.player.danmaku.opacity(percentage);
      };
      const danmakuUp = () => {
        document.removeEventListener(utils.nameMap.dragEnd, danmakuUp);
        document.removeEventListener(utils.nameMap.dragMove, danmakuMove);
      };

      this.player.template.danmakuOpacityBarWrapWrap.addEventListener('click', (event) => {
        const e = event || window.event;
        let percentage = ((e.clientX || e.changedTouches[0].clientX) - utils.getBoundingClientRectViewLeft(this.player.template.danmakuOpacityBarWrap)) / dWidth;
        percentage = Math.max(percentage, 0);
        percentage = Math.min(percentage, 1);
        this.player.danmaku.opacity(percentage);
      });

      this.player.template.danmakuOpacityBarWrapWrap.addEventListener(utils.nameMap.dragStart, () => {
        document.addEventListener(utils.nameMap.dragMove, danmakuMove);
        document.addEventListener(utils.nameMap.dragEnd, danmakuUp);
      });
    }
  }

  hide() {
    this.player.template.settingBox.classList.remove('wplayer-setting-box-open');
    this.player.template.mask.classList.remove('wplayer-mask-show');
    setTimeout(() => {
      this.player.template.settingBox.classList.remove('wplayer-setting-box-narrow');
      this.player.template.settingBox.classList.remove('wplayer-setting-box-speed');
    }, 300);

    this.player.controller.disableAutoHide = false;
  }

  show() {
    this.player.template.settingBox.classList.add('wplayer-setting-box-open');
    this.player.template.mask.classList.add('wplayer-mask-show');

    this.player.controller.disableAutoHide = true;
  }
}

export default Setting;
