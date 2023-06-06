const SKDSCH = window.SKDSCH || {};
SKDSCH.Components = {};

SKDSCH.Components.Register = (selector, ComponentClass) => {
	SKDSCH.Components[ComponentClass.name] = SKDSCH.Components[ComponentClass.name] || [];
	document.querySelectorAll(selector).forEach((element) => {
		const ele = new ComponentClass(element); // eslint-disable-line no-new
		SKDSCH.Components[ComponentClass.name].push(ele);
	});
};
(($) => {
	class Timeline {
		constructor(element) {
			this.TIMELINE_WRAPPER = '.timeline-wrapper';
			this.TIMELINE_CONTAINER = '.timeline-container';
			this.TIMELINE_ITEMS = '.timeline-items';
			this.TIMELINE_NAV_CONTAINER = '.timeline-nav-container';
			this.PREV_BUTTON = '.swiper-button-prev';
			this.NEXT_BUTTON = '.swiper-button-next';
			this.PAGINATION = '.timeline-nav';
			this.PROGRESS_BAR = '.progress-bar';
			this.MERCURY = '.mercury';
			this.ARROW = '.timeline-arrow';
			this.init(element);
		}

		init(element) {
			console.log('element', element);
			this.$element = $(element);
			this.$timelineContainer = this.$element.find(this.TIMELINE_CONTAINER);
			this.$timelineItems = this.$element.find(this.TIMELINE_ITEMS);
			this.$timelineNavContainer = this.$element.find(
				this.TIMELINE_NAV_CONTAINER,
			);
			this.$pagination = this.$element.find(this.PAGINATION);
			this.$mercury = this.$element.find(this.MERCURY);
			this.$arrow = this.$element.find(this.ARROW);
			this.layout = this.$element.data('layout');
			this.initCarousel();
		}

		initCarousel() {
			const _this = this;
			if (this.layout === 'horizontal') {
				
				const timeline = new Swiper(this.$timelineContainer, {
					direction: 'horizontal',
					loop: false,
					pagination: {
						el: this.$pagination,
						clickable: true,
					},
					navigation: {
						nextEl: this.$element.find('.swiper-button-next'),
						prevEl: this.$element.find('.swiper-button-prev'),
					},
					centeredSlides: true,
					slidesPerView: 1,
					spaceBetween: 1,
					on: {
						slideChange() {
							_this.slideChange(timeline);
						},
					},
					breakpoints: {
						992: {
							slidesPerView: 1.3,
							spaceBetween: 30,
						},
						480: {
							slidesPerView: 1.2,
							spaceBetween: 16,
							centeredSlides: true,
						},
					},
				});
			} else {
				
				const $timelineItems = this.$element.find('.swiper-slide');
				const numItems = $timelineItems.length;
				for (let i = 0; i < numItems; i += 1) {
					const $pagDot = $(document.createElement('div'));
					$pagDot.addClass('swiper-pagination-bullet');
					_this.$pagination.append($pagDot);
				}
				const $timelineNavInner = this.$element.find('.timeline-nav-inner');
				const $mercury = $timelineNavInner.find('.mercury');
				const $arrow = $timelineNavInner.find('.timeline-arrow');
				const $pagDots = $timelineNavInner.find('.swiper-pagination-bullet');
				const incrementPercentage = 100 / numItems;

				$pagDots.first().addClass('previous-bullet');

				$(window).on('load resize scroll', () => {
					const timelineHeight = _this.$element.outerHeight();
					const offsetTop = _this.$element.offset().top - 60; // Subtract 60 to adjust for fixed header
					const offsetBottom = offsetTop + timelineHeight;
					const timelineInnerHeight = $timelineNavInner.outerHeight() + 120;
					const scrollTop = $(window).scrollTop();
					if (
						scrollTop > offsetTop
						&& scrollTop < offsetBottom - timelineInnerHeight
					) {
						$timelineNavInner.removeClass('bottom');
						$timelineNavInner.addClass('fixed');
						const lastHeight = $timelineItems.last().outerHeight();
						const scrollPercentage = ((scrollTop - offsetTop) / (timelineHeight - lastHeight)) * 100;
						const pagPercentage = ((scrollTop - offsetTop) / timelineHeight) * 100;
						$mercury.css('height', `${scrollPercentage}%`);
						if (scrollPercentage < 100) {
							$arrow.css('top', `${scrollPercentage}%`);
						} else {
							$arrow.css('top', '100%');
						}
						for (let j = 0; j < numItems; j += 1) {
							const dot = $($pagDots[j]);
							if (pagPercentage >= j * incrementPercentage - 1) {
								dot.addClass('swiper-pagination-bullet-active');
							} else {
								dot.removeClass('swiper-pagination-bullet-active');
							}
						}
					} else if (scrollTop >= offsetBottom - timelineInnerHeight) {
						$timelineNavInner.removeClass('fixed').addClass('bottom');
						$pagDots.addClass('swiper-pagination-bullet-active');
						$mercury.css('height', '100%');
						$arrow.css('top', '100%');
					} else {
						$timelineNavInner.removeClass('fixed');
						$timelineNavInner.removeClass('bottom');
					}
				});
				$pagDots.on('click', () => {
					const index = $(this).index();
					const offset = $timelineItems.eq(index).offset().top - 60;
					$('html').scrollTop(offset);
					$('html body').animate(
						{
							scrollTop: offset,
						},
						500,
					);
				});
				$(window).on('load resize', () => {
					const offsetLeft = _this.$element.offset().left;
					_this.$timelineNavContainer.css({
						left: -offsetLeft,
						display: 'block',
					});
				});
				$(window).on('load', () => {
					_this.$timelineContainer.addClass('content-container');
				});
			}

			const numItems = this.$pagination.find('.swiper-pagination-bullet').length;
			if (numItems > 5) {
				this.$timelineNavContainer.addClass('wide');
			}
		}

		slideChange(timeline) {
			// update progress bar on slide change
			const progressPercent = timeline.progress * 100;
			const currentSlideIndex = timeline.realIndex;
			this.$mercury.css('width', `${progressPercent}%`);
			this.$arrow.css('left', `${progressPercent}%`);
			const $dots = this.$pagination.find('.swiper-pagination-bullet');
			$dots.each((index) => {
				if (index < currentSlideIndex) {
					$(this).addClass('previous-bullet');
				} else {
					$(this).removeClass('previous-bullet');
				}
			});
		}
	}



	// $('[data-toggle="tooltip"]').tooltip(); 

	// $('.swiper-pagination-bullet[data-toggle="tooltip"]').tooltip({
	// 	animated: 'fade',
	// 	placement: 'bottom'
	// });
	SKDSCH.Components.Register('.timeline-wrapper', Timeline);
})(jQuery);


