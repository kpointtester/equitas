Kp_branchingWidget = function (options) {
    var self = this;
    this.values = {
      NAME: "Branching",
    };
    self.controller = options.controller;
    self.player = options.player;
    self.config = options.config;

    function validateConfig() {
      self.config.validation_status = true;
  
      for (const list of self.config.list) {
        if (Array.isArray(list.branchList) && list.branchList.length > 0) {
          list.count = 0;
          list.isShowed = false;
          list.selected_branch = -1;
  
          for (const branch of list.branchList) {
            if (branch.sub_branch) {
              const subBranch = branch.sub_branch;
              branch.start_time =
                branch.sub_branches[subBranch]?.[0] || branch.start_time;
              branch.end_time =
                branch.sub_branches[subBranch]?.[1] || branch.end_time;
            }
          }
        } else {
          self.config.validation_status = false;
        }
      }
    }
  
    self.on_timeupdate = function (time) {
      if (!self.config.validation_status) {
        return;
      }
      var t = Math.trunc(time / 1000);
      for (var list of self.config.list) {
        //todo:move to validateConfig
        if (!Array.isArray(list.branchList) || list.branchList.length === 0) {
          continue;
        }
        var branchVisited = false;
        const start_time_ms = list.start_time * 1000;
        if (
          list.selected_branch !== -1 &&
          (list.branchList[list.selected_branch].start_time > t ||
            list.branchList[list.selected_branch].end_time < t)
        ) {
          self.player.seekTo(start_time_ms);
          list.selected_branch = -1;
          if (list.on_loop === "false") {
            branchVisited = true;
          }
          continue;
        }
        if (t >= list.start_time && t < list.end_time) {
          list.isShowed = true;
          self.view.renderWidget(0);
        } else if (list.selected_branch === -1 && list.isShowed) {
          if (list.behaviour === "loop") {
            list.isShowed = false;
            self.player.seekTo(start_time_ms);
          } else if (list.behaviour === "seek" && !branchVisited) {
            list.isShowed = false;
            self.player.seekTo(list.seek_to * 1000);
          } else if (list.behaviour === "pause" && t === list.end_time) {
            self.player.pauseVideo();
          }
        } else {
          self.view.removeWidget(0);
          list.count = 0;
        }
      }
    };
  
    self.track = function (data) {};
  
    self.view = new Kp_branchingView({
      controller: self,
      container: options.container,
      player: options.player,
      config: self.config,
      util: options.util,
    });
  
    const init = () => {
      validateConfig();
    };
  
    init();
  };
  