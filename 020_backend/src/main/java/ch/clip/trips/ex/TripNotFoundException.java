package ch.clip.trips.ex;

public class TripNotFoundException extends RuntimeException {
	private static final long serialVersionUID = 7334815941308526816L;

	public TripNotFoundException(Long id ) {
		super("could not find trip "+id);
	}
} 