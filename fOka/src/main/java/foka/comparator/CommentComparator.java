package foka.comparator;

import java.util.Comparator;

public class CommentComparator implements Comparator<String>{

	@Override
	public int compare(String comment1, String comment2) {
		if (comment1.equals(comment2)) {
			return 0;
		}
		int comm1 = Integer.parseInt(comment1.substring(0,  1));
		int comm2 = Integer.parseInt(comment2.substring(0,  1));
		if (comm1 < comm2) {
			return 1;
		}
		return -1;
	}

}
