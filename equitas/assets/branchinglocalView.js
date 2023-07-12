Kp_branchingView = function (options) {
  var self = this;
  var $ = $kPointQuery;
  self.player = options.player;
  self.controller = options.controller;
  self.DOM = {
    PLAYER_OVERLAY: ".player-overlay",
    BRANCHING_CONTAINER: ".branching-container-",
  };
  const playerOverlay = $(options.container).find(".player-overlay");

  const handleHomeButtonClick = (e) => {
    const widgetConfig = options.config.list[0];
    if (
      widgetConfig.homeButtonEnterAnimation &&
      widgetConfig.homeButtonEnterAnimation.isActive()
    ) {
      widgetConfig.homeButtonEnterAnimation.progress(1, false);
    }
    if (
      widgetConfig.animations.home_button_select &&
      widgetConfig.animations.home_button_select.length > 0
    ) {
      widgetConfig.homeButtonSelectAnimation = generateTimeline(
        widgetConfig.animations.home_button_select,
        null,
        playerOverlay[0],
        e.target
      );
      widgetConfig.homeButtonSelectAnimation.play();
      widgetConfig.homeButtonSelectAnimation.eventCallback("onComplete", () => {
        $(`.kpw-branching-home-button-container-0`, self.container).remove();
        options.player.seekTo(widgetConfig.start_time * 1000);
        widgetConfig.selected_branch = -1;
      });
    } else {
      $(`.kpw-branching-home-button-container-0`, self.container).remove();
      options.player.seekTo(widgetConfig.start_time * 1000);
      widgetConfig.selected_branch = -1;
    }
  };

  const handleHomeButtonMouseOver = (e) => {
    const widgetConfig = options.config.list[0];
    if (
      widgetConfig.homeButtonHoverAnimation &&
      widgetConfig.homeButtonHoverAnimation.isActive()
    ) {
      widgetConfig.homeButtonHoverAnimation.progress(1, false);
    }
    if (widgetConfig.animations.home_button_hover) {
      widgetConfig.homeButtonHoverAnimation = generateTimeline(
        widgetConfig.animations.home_button_hover,
        null,
        playerOverlay[0],
        e.target
      );
      widgetConfig.homeButtonHoverAnimation.play();
    }
  };

  const handleHomeButtonMouseOut = (e) => {
    const widgetConfig = options.config.list[0];
    if (
      widgetConfig.homeButtonHoverAnimation &&
      widgetConfig.homeButtonHoverAnimation.isActive()
    ) {
      widgetConfig.homeButtonHoverAnimation.progress(1, false);
    }
    if (widgetConfig.animations.home_button_unhover) {
      widgetConfig.homeButtonUnHoverAnimation = generateTimeline(
        widgetConfig.animations.home_button_unhover,
        null,
        playerOverlay[0],
        e.target
      );
      widgetConfig.homeButtonUnHoverAnimation.play();
    }
  };

  const handleClick = (e) => {
    const branchId = $(e.target).data("index");

    const widgetConfig = options.config.list[0];
    const branchConfig = widgetConfig.branchList[branchId];

    const selectBranch = () => {
      $(`.branching-container-0`, self.container).remove();
      options.player.seekTo(branchConfig.start_time * 1000);
      widgetConfig.selected_branch = branchId;
      //todo: update the track parameters
      self.controller.track({
        type: "BW",
        name: "branching",
        event: "opened",
        imprssionScore: branchConfig.imprssion_score,
      });

      if (widgetConfig.home_button_template) {
        let markup = $(`#${widgetConfig.home_button_template}`).html();
        markup = `<div class="kpw-branching-home-button-container-${0} branching-container" data-index="0">${markup}</div>`;
        $(markup).appendTo(playerOverlay);

        if (
          widgetConfig.animations.home_button_enter &&
          widgetConfig.animations.home_button_enter.length > 0
        ) {
          widgetConfig.homeButtonEnterAnimation = generateTimeline(
            widgetConfig.animations.home_button_enter,
            null,
            playerOverlay[0]
          );
          widgetConfig.homeButtonEnterAnimation.play();
        }
        widgetConfig.homeButtonEnterAnimation = generateTimeline(
          widgetConfig.animations.home_button_enter,
          null,
          playerOverlay[0]
        );

        $(`.kpw-branch-home-button`, playerOverlay).on(
          "click",
          handleHomeButtonClick
        );
        $(`.kpw-branch-home-button`, playerOverlay).on(
          "mouseover",
          handleHomeButtonMouseOver
        );
        $(`.kpw-branch-home-button`, playerOverlay).on(
          "mouseout",
          handleHomeButtonMouseOut
        );
      }
    };
    //Check is there any branch select animation or not
    if (
      widgetConfig.animations.branch_select &&
      widgetConfig.animations.branch_select.length > 0
    ) {
      const timeline = generateTimeline(
        widgetConfig.animations.branch_select,
        null,
        playerOverlay[0],
        e.target
      );
      timeline.play();
      //on complete of animation call the branch select
      timeline.eventCallback("onComplete", selectBranch);
    } else {
      selectBranch();
    }
  };

  const handleMouseOver = (e) => {
    //find .kpw-branch or nearest parent
    const element = $(e.target).closest(".kpw-branch");
    const branchId = $(element).data("index");

    // //find parent .kpw-branching-container
    // const index = $(e.target).parents(".kpw-branching-container").data("index");

    //todo: curently only one branch is supported if multiple branches are supported then we need to change this logic
    const widgetConfig = options.config.list[0];

    //if enter animation is playing then don't play the hover animation

    // if (
    //   widgetConfig.branchEnterAnimation &&
    //   widgetConfig.branchEnterAnimation.progress() < 1
    // ) {
    //   return;
    // }
    // if (
    //   widgetConfig.branchRevisitAnimation &&
    //   widgetConfig.branchRevisitAnimation.progress() < 1
    // ) {
    //   return;
    // }

    if (
      !widgetConfig.animations.branch_hover ||
      widgetConfig.animations.branch_hover.length === 0
    ) {
      return;
    }
    const timeline = generateTimeline(
      widgetConfig.animations.branch_hover,
      null,
      playerOverlay[0],
      element
    );
    timeline.play();
  };

  const handleMouseOut = (e) => {
    const element = $(e.target).closest(".kpw-branch");
    const branchId = $(e.target).data("index");
    //find parent .kpw-branching-container
    // const index = $(e.target).parents(".kpw-branching-container").data("index");

    const widgetConfig = options.config.list[0];

    if (widgetConfig.branchEnterAnimation) {
      widgetConfig.branchEnterAnimation.progress(1);
    }
    if (widgetConfig.branchRevisitAnimation) {
      widgetConfig.branchRevisitAnimation.progress(1);
    }
    if (
      !widgetConfig.animations.branch_unhover ||
      widgetConfig.animations.branch_unhover.length === 0
    ) {
      return;
    }
    const timeline = generateTimeline(
      widgetConfig.animations.branch_unhover,
      null,
      playerOverlay[0],
      element
    );
    timeline.play();
  };

  const generateTimeline = (list, timeline, parent, fixedTarget) => {
    if (!timeline) {
      timeline = gsap.timeline({ paused: true });
    }
    list.forEach(
      ({
        target = null,
        duration = 1,
        from = {},
        to = {},
        position = null,
      }) => {
        if (fixedTarget && target === null) {
          target = fixedTarget;
        }
        timeline.fromTo($(target, parent), duration, from, to, position);
      }
    );
    return timeline;
  };

  function addGsapTimelines(widgetConfig) {
    if (widgetConfig.animations.enter) {
      widgetConfig.branchEnterAnimation = generateTimeline(
        widgetConfig.animations.enter,
        null,
        playerOverlay[0]
      );
    }
    if (widgetConfig.animations.revisit) {
      widgetConfig.branchRevisitAnimation = generateTimeline(
        widgetConfig.animations.revisit,
        null,
        playerOverlay[0]
      );
    }
  }

  self.renderWidget = function (index) {
    if ($(self.DOM.BRANCHING_CONTAINER + index, self.container).length > 0) {
      return;
    }
    const widgetConfig = options.config.list[index];

    let markup = "";
    markup = $(`#${widgetConfig.template}`).html();
    if (!markup) {
      return;
    }
    const widget = `<div class="branching-container-${index} branching-container" data-index="${index}" style="pointer-events:none">
            ${markup}
            </div>`;
    playerOverlay.append(widget);

    addGsapTimelines(widgetConfig);

    if (!widgetConfig.isShowed) {
      widgetConfig.branchEnterAnimation.play();
      widgetConfig.isShowed = true;
    } else if (
      widgetConfig.isShowed &&
      widgetConfig.branch_revisit_animation &&
      widgetConfig.branch_revisit_animation.length > 0
    ) {
      widgetConfig.branchRevisitAnimation.play();
      widgetConfig.branchRevisitAnimation.eventCallback("onComplete", () => {
        $(".kpw-branch", playerOverlay[0]).mouseover(handleMouseOver);
        $(".kpw-branch", playerOverlay[0]).mouseout(handleMouseOut);
      });
    } else {
      widgetConfig.branchEnterAnimation.play();
      widgetConfig.branchRevisitAnimation.progress(1);
      widgetConfig.branchEnterAnimation.eventCallback("onComplete", () => {
        $(".kpw-branch", playerOverlay[0]).mouseover(handleMouseOver);
        $(".kpw-branch", playerOverlay[0]).mouseout(handleMouseOut);
      });
    }
    //add event listener on kpw-branch in player overlay
    $(".kpw-branch", playerOverlay[0]).on("click", handleClick);
  };

  self.removeWidget = function (index) {
    $(`.branching-container-${index}`, self.container).remove();
  };
};
