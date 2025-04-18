define RULE =
compressed/$(strip $1) : $1 Makefile compressed
	echo "- $(strip $1)"
	magick "$(strip $1)" -resize 1215x355 JPG:- | cjpeg -quality $(strip $2) > "compressed/$(strip $1)"
endef

autorun: $(patsubst %, compressed/%, $(wildcard *.jpg));

compressed:
	mkdir compressed

$(eval $(call RULE, downing-st.jpg, 30))
$(eval $(call RULE, popeye.jpg, 50))
$(eval $(call RULE, world.jpg, 30))

clean:
    ifneq "$(wildcard compressed)" ""
		rm -r compressed
    endif
