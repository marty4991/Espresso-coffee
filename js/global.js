"use strict";
window.addEventListener('load', function () {
    const cartQty = $('.navcart-dropdown .cart-qty').html() || 0,
        homeSections = document.querySelectorAll('.homepage .section'),
        productFinderSection = document.querySelector('.section-product-finder'),
        siteHeader = document.querySelector('.site-header');
    let homeSectionInView = null;
    setHomeSectionInView();

    window.addEventListener('scroll', function () {
        setHomeSectionInView();
    });

    /**
     *
     * isPhone()
     * check if phone resolution
     * returns bool;
     * duplicate from menu.js
     */
    let isPhone = function () {
        const phoneVW = 767.98;
        let viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        if (viewportWidth < phoneVW) {
            return true;
        }
        return false;
    }

    /**
     *
     * Header Cart quantity
     * manage the cart qty display
     * should run on updateCart event;
     *
     */
    if (cartQty > 0) {
        $('.navcart-dropdown .cart-qty').removeClass('d-none');
        $('.navcart-dropdown span[class^="icon-"]').removeAttr('class').addClass('icon-shoppingcart-full');
    }

    $('.btn-guest-checkout')[0].addEventListener('click', function (e) {
        //close modal
        $(this).parents('.modal').modal('hide');
        //continue
        console.log('checking out as guest...');
    });


    /**
     *
     * init Floating Forms Labels
     *
     */
    $('.ffl-wrapper').floatingFormLabels();

    /**
     *
     * init footerReveal
     *
     */
    $('.site-footer').footerReveal();
    $('.site-footer').trigger('footerRevealResize');

    document.addEventListener('click', function (e) {
        handlerModals(e);

        if (e.target.dataset.action === 'toggleProductFinder') {
            e.preventDefault();
            if (isPhone()) {
                toggleMenuOffCanvas();
                positionAndScrollToProductFinder();
            } else {
                positionAndScrollToProductFinder();
            }
        }

        if (e.target.dataset.dismiss === 'sectionProductFinder') {
            toggleProductFinderActive();
        }

        if (e.target.getAttribute('href') !== null &&
            e.target.getAttribute('href') !== "#" &&
            e.target.getAttribute('href').substring(0, 1) === "#" &&
            e.target.getAttribute('role') !== 'tab') {
            e.preventDefault();

            const sectionId = e.target.getAttribute('href').substring(1),
                section = document.getElementById(sectionId),
                siteHeaderBounding = siteHeader.getBoundingClientRect();
            let scrollOffset = section.offsetTop - siteHeaderBounding.height;

            if (isPhone()) {
                toggleMenuOffCanvas();
            }

            $('html, body').animate({ scrollTop: scrollOffset }, 500);

            if (productFinderSection.classList.contains('active')) {
                toggleProductFinderActive();
            }
        }
    });

    /**
     *
     * handlerModals(event)
     * pass in the event and check if a data-modal-id element has been triggered;
     * 
     */
    function handlerModals(e) {
        let modalId = e.target.dataset.modalId;
        if (!modalId) return;

        e.preventDefault();
        let foundModal = document.getElementById(modalId);

        if ($('.modal.show').length) {
            $('.modal').modal('hide');
        }
        $(foundModal).modal('show');
    }

    /**
     *
     * setHomeSectionInView()
     * looping through the home sections, stops when the first section with bottom part still visible is found;
     * 
     */
    function setHomeSectionInView() {
        for (let i = 0; i < Array.from(homeSections).length; i++) {
            if (sectionIsInViewport(homeSections[i])) {
                if (homeSections[i] !== null && typeof homeSections[i] !== 'undefined') {
                    homeSectionInView = homeSections[i];
                    break;
                }
            }
        }
    }

    /**
     *
     * positionAndScrollToProductFinder()
     * scrolls to bottom of homeSectionInView and positions the productFinder section in the page
     * 
     */
    function positionAndScrollToProductFinder() {
        const mainContainer = document.querySelector('.main-homepage'),
            siteHeaderBounding = siteHeader.getBoundingClientRect(),
            currentSectionInView = homeSectionInView,
            currentSectionInViewBounding = currentSectionInView.getBoundingClientRect();

        let scrollOffset = (currentSectionInView.offsetTop + currentSectionInViewBounding.height) - siteHeaderBounding.height;
        if (currentSectionInView !== null) {
            mainContainer.insertBefore(productFinderSection, currentSectionInView.nextSibling);

            if (scrollOffset === window.scrollY) {
                toggleProductFinderActive();
            } else {
                $('html').animate({ scrollTop: scrollOffset }, 500, function () {
                    toggleProductFinderActive();
                });
            }
        }
    }

    /**
     *
     * toggleProductFinderActive()
     * handling the animation and classes of the productFinder section;
     * 
     */
    function toggleProductFinderActive() {
        if (!productFinderSection.classList.contains('active')) {
            productFinderSection.classList.add('active');
            TweenMax.to(productFinderSection, .2, {
                height: $(productFinderSection).find('>.container').outerHeight() + $(productFinderSection).outerHeight(),
                ease: Expo.easeOut,
                clearProps: 'all',
                onComplete: function () {
                    productFinderSection.classList.add('animation__completed');
                }
            });
        } else {
            TweenMax.to(productFinderSection, .2, {
                height: 0,
                ease: Expo.easeOut,
                onComplete: function () {
                    productFinderSection.classList.remove('animation__completed', 'active');
                }
            });
        }
    }

    /**
     *
     * sectionIsInViewport(elem);
     * checks if the bottom part of the element is visible in current viewport / scrolling area
     *
     */
    function sectionIsInViewport(elem) {
        let bounding = elem.getBoundingClientRect();
        const siteHeaderBounding = document.querySelector('.site-header').getBoundingClientRect();
        return (
            elem.offsetTop + bounding.height - siteHeaderBounding.height >= window.scrollY
        );
    };

    /**
     *
     * toggleMenuOffCanvas();
     * Toggle the menu offcanvas left 
     * duplicate from menu.js
     *
     */
    function toggleMenuOffCanvas() {
        $('.offcanvas-collapse').toggleClass('open');
        $('body').toggleClass('offcanvas-active');
        $('.navbar-toggler').toggleClass('is-active');

        TweenMax.to(document.querySelector('.offcanvas'), .7, { width: "82vw", ease: Elastic.easeOut.config(1, 0.35) }).delay(.3);
        TweenMax.to(document.querySelector('.offcanvas'), .7, { width: "80vw", ease: Elastic.easeOut.config(1, 0.35) }).delay(.5);
    }
});